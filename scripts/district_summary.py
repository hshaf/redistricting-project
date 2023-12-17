import sys
import os
import json
import re

import requests
import pymongo
import numpy as np
import pandas as pd
import geopandas

URL = 'http://localhost:8080'
client = pymongo.MongoClient()
db = client.redistricting                                                                                                                                                                                    

def main():
    # Process args
    precinct_file_path = sys.argv[1]
    ensemble_dir_path = sys.argv[2]
    state = sys.argv[3].upper()
    ensemble_name = sys.argv[4]
    distance_metric = sys.argv[5]
    num_clusters = None
    if len(sys.argv) > 6:
        num_clusters = int(sys.argv[6])

    try:
        import pyogrio
        geopandas.options.io_engine = "pyogrio"
    except ImportError:
        print("pyogrio could not be imported, using fiona")
    
    precinct_df = geopandas.read_file(precinct_file_path).set_index("vtd_geo_id")

    # Initialize states if they have not been created
    if len(list(db.state.find())) == 0:
        state_data = [
            {
                "_id": "AZ",
                "name": "Arizona",
                "districtPlanType": "State Assembly",
                "stateBoundary": "../data/state_boundaries/az-state-boundary.json",
                "currDistrictPlanBoundary": "../data/state_boundaries/az-districts.json",
                "mapCenter": [34.35920229576733, -111.82765189051278],
                "mapZoom": 7,
                "ensembleClusterAssociation": [],
                "ensembleIds": []
            },
            {
                "_id": "VA",
                "name": "Virginia",
                "districtPlanType": "State Assembly",
                "stateBoundary": "../data/state_boundaries/va-state-boundary.json",
                "currDistrictPlanBoundary": "../data/state_boundaries/va-districts.json",
                "mapCenter": [37.47812615585515, -78.88801623378961],
                "mapZoom": 7,
                "ensembleClusterAssociation": [],
                "ensembleIds": []
            },
            {
                "_id": "WI",
                "name": "Wisconsin",
                "districtPlanType": "State Senate",
                "stateBoundary": "../data/state_boundaries/wi-state-boundary.json",
                "currDistrictPlanBoundary": "../data/state_boundaries/wi-districts.json",
                "mapCenter": [44.61389658316453, -89.67045816895208],
                "mapZoom": 7,
                "ensembleClusterAssociation": [],
                "ensembleIds": []
            }
        ]
        db_setup(state_data)

    # Get district plan and cluster data
    district_plan_files = sorted([os.path.join(ensemble_dir_path, f) for f in os.listdir(ensemble_dir_path) if re.fullmatch(r"\d\d\d\d\d.json", f)])
    district_plan_data = district_summary_data(precinct_df=precinct_df, 
                                                district_plan_files=district_plan_files, 
                                                distance_file=os.path.join(ensemble_dir_path, f"mds_points_{distance_metric}.txt"))
    cluster_data, cluster_assignments, centermost_plans, plans_to_render = cluster_summary_data(district_plan_data=district_plan_data,
                                                                                                ensemble_dir_path=ensemble_dir_path,
                                                                                                distance_metric=distance_metric,
                                                                                                num_clusters=num_clusters
                                                                                                )
    files_to_render = [district_plan_files[i] for i in plans_to_render]
    boundary_db_ids = save_boundaries(precinct_df=precinct_df, district_plan_files=files_to_render)
    district_plan_db_ids = save_district_plans(district_plan_data=district_plan_data,
                                                plans_to_render=plans_to_render,
                                                boundary_db_ids=boundary_db_ids)
    cluster_db_ids = save_clusters(cluster_data=cluster_data,
                                    centermost_plans=centermost_plans,
                                    district_plan_db_ids=district_plan_db_ids)
    ensemble_db_id = save_ensemble(ensemble_dir_path=ensemble_dir_path,
                                    state=state, name=ensemble_name,
                                    cluster_db_ids=cluster_db_ids,
                                    num_district_plans=len(district_plan_data))

    # Add ensemble to state
    state_db_obj = db.state.find_one({"_id": state})
    new_ensemble_list = state_db_obj["ensembleIds"] + [ensemble_db_id]
    db.state.update_one({"_id": state}, {"$set": {"ensembleIds": new_ensemble_list}})

def district_summary_data(precinct_df: geopandas.GeoDataFrame, district_plan_files: list, distance_file: str = None):
    # Generate district summaries
    district_plan_data = list()
    if distance_file is not None:
        mds_points = np.loadtxt(distance_file, delimiter=",")
    for i, file in enumerate(district_plan_files):
        with open(file, mode='r', encoding='utf-8') as f:
            assign_dict = json.load(f)

        # Populate district_dict by accumulating precincts into districts
        precinct_df["district_assignment"] = pd.Series(data=assign_dict)
        district_df = precinct_df.groupby("district_assignment").sum()

        # Process district plan data
        dem_districts = (district_df['vote_dem'] > district_df['vote_rep']).sum()
        rep_districts = (district_df['vote_rep'] > district_df['vote_dem']).sum()

        maj_black_districts = ((district_df['pop_black'] / district_df['pop_total']) >= 0.5)
        maj_asian_districts = ((district_df['pop_asian'] / district_df['pop_total']) >= 0.5)
        maj_native_districts = ((district_df['pop_native'] / district_df['pop_total']) >= 0.5)
        maj_pacific_districts = ((district_df['pop_pacific'] / district_df['pop_total']) >= 0.5)
        maj_hispanic_districts = ((district_df['pop_hispanic'] / district_df['pop_total']) >= 0.5)
        maj_min_districts = (maj_black_districts | maj_asian_districts | maj_native_districts | maj_pacific_districts | maj_hispanic_districts)

        mds_coords = [0.0, 0.0]
        if distance_file:
            mds_coords = mds_points[i].tolist()

        district_plan_entry = {
            "mdsCoords": mds_coords,
            "numDemocraticDistricts": dem_districts.item(),
            "numRepublicanDistricts": rep_districts.item(),
            "majMinDistricts": {
                "totalMajMin": maj_min_districts.sum().item(),
                "majBlack": maj_black_districts.sum().item(),
                "majAsian": maj_asian_districts.sum().item(),
                "majNative": maj_native_districts.sum().item(),
                "majPacific": maj_pacific_districts.sum().item(),
                "majHispanic": maj_hispanic_districts.sum().item()
            },
            "boundary": None
        }

        # Add district plan data to output
        district_plan_data.append(district_plan_entry)
    
    return district_plan_data

def cluster_summary_data(district_plan_data: list, ensemble_dir_path: str, distance_metric: str, num_clusters: int = None):
    with open(os.path.join(ensemble_dir_path, f"clusters_{distance_metric}.json"), mode='r', encoding='utf-8') as f:
        cluster_grouping_data = json.load(f)

    # Select predictions based on selected cluster count
    # Select cluster count based on lowest BIC if not specified
    if num_clusters is None:
        min_bic_k = None
        for key, grouping_data_entry in cluster_grouping_data.items():
            if (min_bic_k is None) or (grouping_data_entry["bic"] < cluster_grouping_data[str(min_bic_k)]["bic"]):
                min_bic_k = int(key)
        num_clusters = min_bic_k
    cluster_grouping = cluster_grouping_data[str(num_clusters)]

    # Create cluster entries, fill in cluster center data
    cluster_data = list()
    for i, center_coords in enumerate(cluster_grouping["cluster_centers"]):
        cluster_entry = {
            "districtPlanCount": 0,
            "districtPlanIds": [],
            "clusterCenter": center_coords,
            "avgDemocraticDistricts": 0,
            "avgRepublicanDistricts": 0,
            "minDemocraticDistricts": float("inf"),
            "minRepublicanDistricts": float("inf"),
            "maxDemocraticDistricts": 0,
            "maxRepublicanDistricts": 0,
            "avgMajMinDistricts": {
                "totalMajMin": 0,
                "majBlack": 0,
                "majAsian": 0,
                "majNative": 0,
                "majPacific": 0,
                "majHispanic": 0
            }
        }
        cluster_data.append(cluster_entry)
    
    # Assign district plans to clusters, calculate average value for each data field per cluster
    for district_index, cluster_assignment in enumerate(cluster_grouping["predictions"]):
        district_plan_dict = district_plan_data[district_index]
        assigned_cluster_dict = cluster_data[cluster_assignment]

        assigned_cluster_dict["districtPlanIds"].append(district_index)
        
        assigned_cluster_dict["minDemocraticDistricts"] = min(assigned_cluster_dict["minDemocraticDistricts"], district_plan_dict["numDemocraticDistricts"])
        assigned_cluster_dict["minRepublicanDistricts"] = min(assigned_cluster_dict["minRepublicanDistricts"], district_plan_dict["numRepublicanDistricts"])
        assigned_cluster_dict["maxDemocraticDistricts"] = max(assigned_cluster_dict["maxDemocraticDistricts"], district_plan_dict["numDemocraticDistricts"])
        assigned_cluster_dict["maxRepublicanDistricts"] = max(assigned_cluster_dict["maxRepublicanDistricts"], district_plan_dict["numRepublicanDistricts"])

        assigned_cluster_dict["avgDemocraticDistricts"] += district_plan_dict["numDemocraticDistricts"]
        assigned_cluster_dict["avgRepublicanDistricts"] += district_plan_dict["numRepublicanDistricts"]
        assigned_cluster_dict["avgMajMinDistricts"]["totalMajMin"] += district_plan_dict["majMinDistricts"]["totalMajMin"]
        assigned_cluster_dict["avgMajMinDistricts"]["majBlack"] += district_plan_dict["majMinDistricts"]["majBlack"]
        assigned_cluster_dict["avgMajMinDistricts"]["majAsian"] += district_plan_dict["majMinDistricts"]["majAsian"]
        assigned_cluster_dict["avgMajMinDistricts"]["majNative"] += district_plan_dict["majMinDistricts"]["majNative"]
        assigned_cluster_dict["avgMajMinDistricts"]["majPacific"] += district_plan_dict["majMinDistricts"]["majPacific"]
        assigned_cluster_dict["avgMajMinDistricts"]["majHispanic"] += district_plan_dict["majMinDistricts"]["majHispanic"]

    for i in range(num_clusters):
        cluster_data[i]["districtPlanCount"] = len(cluster_data[i]["districtPlanIds"])
        cluster_data[i]["avgDemocraticDistricts"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgRepublicanDistricts"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgMajMinDistricts"]["totalMajMin"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgMajMinDistricts"]["majBlack"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgMajMinDistricts"]["majAsian"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgMajMinDistricts"]["majNative"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgMajMinDistricts"]["majPacific"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["avgMajMinDistricts"]["majHispanic"] /= cluster_data[i]["districtPlanCount"]

    # Identify district plans in each cluster closest to the center
    centermost_plans = list()
    for i in range(num_clusters):
        cluster_center = cluster_data[i]["clusterCenter"]
        closest_district_index = cluster_data[i]["districtPlanIds"][0]
        for j in range(1, cluster_data[i]["districtPlanCount"]):
            curr_district_index = cluster_data[i]["districtPlanIds"][j]
            closest_district_coords = district_plan_data[closest_district_index]["mdsCoords"]
            curr_district_coords = district_plan_data[curr_district_index]["mdsCoords"]
            closest_district_dist = ((cluster_center[0] - closest_district_coords[0])**2 + (cluster_center[1] - closest_district_coords[1])**2)**0.5
            curr_district_dist = ((cluster_center[0] - curr_district_coords[0])**2 + (cluster_center[1] - curr_district_coords[1])**2)**0.5
            if curr_district_dist < closest_district_dist:
                closest_district_index = curr_district_index
        centermost_plans.append(closest_district_index)

    # Identify other "interesting" district plans to be rendered
    # TODO
    plans_to_render = list()
    plans_to_render.extend(centermost_plans)
    plans_to_render = list(set(plans_to_render))

    return cluster_data, cluster_grouping["predictions"], centermost_plans, plans_to_render

def db_setup(state_data):
    for state_obj in state_data:
        # Insert state and current district boundaries and get DB IDs
        with open(state_obj["stateBoundary"], mode="r", encoding="utf-8") as f:
            #state_boundary = json.load(f)
            state_boundary = f.read()
        state_obj["stateBoundary"] = db.boundary.insert_one({"category": "state_boundary", "data": state_boundary}).inserted_id
        with open(state_obj["currDistrictPlanBoundary"], mode="r", encoding="utf-8") as f:
            #state_boundary = json.load(f)
            state_boundary = f.read()
        state_obj["currDistrictPlanBoundary"] = db.boundary.insert_one({"category": "curr_district_plan", "data": state_boundary}).inserted_id

        # Insert state object
        db.state.insert_one(state_obj)

def save_boundaries(precinct_df: geopandas.GeoDataFrame, district_plan_files: list):
    # Generate district boundaries
    boundary_db_ids = list()
    for dp_file in district_plan_files:
        # Load district assignments
        with open(dp_file, mode='r', encoding='utf-8') as f:
            assign_dict = json.load(f)
        precinct_df["district_assignment"] = pd.Series(data=assign_dict)
        
        # Create boundary by combining precincts into districts
        boundary = precinct_df[["geometry", "district_assignment"]].dissolve(by="district_assignment")

        # Save to database
        inserted_id = db.boundary.insert_one({"category": "districtPlan", "data": boundary.to_json()}).inserted_id
        boundary_db_ids.append(inserted_id)
    return boundary_db_ids

def save_district_plans(district_plan_data: list, plans_to_render: list, boundary_db_ids: list):
    # Save each district plan to the database and record the database ID for each
    district_plan_db_ids = list()
    for entry in district_plan_data:
        inserted_id = db["districtPlan"].insert_one(entry).inserted_id
        district_plan_db_ids.append(inserted_id)

    # Add boundaries to district plans
    for index, b_id in zip(plans_to_render, boundary_db_ids):
        db["districtPlan"].update_one({"_id": district_plan_db_ids[index]}, {"$set": {"boundary": b_id}})
    
    return district_plan_db_ids

def save_clusters(cluster_data: list, centermost_plans: list, district_plan_db_ids: list):
    # Save each cluster to the database and record the database ID for each
    cluster_db_ids = list()
    for entry, center_plan_index in zip(cluster_data, centermost_plans):
        # Find centermost district plan and get boundary ID
        center_plan_obj = db["districtPlan"].find_one({"_id": district_plan_db_ids[center_plan_index]})
        entry["boundary"] = center_plan_obj["boundary"]

        # Set districtPlanIds (mapping from indices to database IDs)
        entry["districtPlanIds"] = [district_plan_db_ids[i] for i in entry["districtPlanIds"]]

        # Insert object and get database ID
        inserted_id = db.cluster.insert_one(entry).inserted_id
        cluster_db_ids.append(inserted_id)
    return cluster_db_ids

def save_ensemble(ensemble_dir_path: str, state: str, name: str, cluster_db_ids: list, num_district_plans: int):
    # Determine average value for each distance measure
    distance_measures = ["optimal_transport", "hamming", "entropy"]
    distance_measure_keys = [(dm.split("_", maxsplit=1)[0] + "".join([w.capitalize() for w in dm.split("_")[1:]])) for dm in distance_measures]
    distances_dict = dict([(d, None) for d in distance_measure_keys])
    for dm, dk in zip(distance_measures, distance_measure_keys):
        if os.path.isfile(os.path.join(ensemble_dir_path, f"distance_{dm}.txt")):
            with open(os.path.join(ensemble_dir_path, f"distance_{dm}.txt"), encoding="utf-8") as distance_file:
                distances = np.loadtxt(distance_file, delimiter=",")
                distances_dict[dk] = distances.mean()

    # Save ensemble to database and record the database ID
    ensemble_obj = {
        "name": name,
        "totalDistrictPlanCount": num_district_plans,
        "totalClusterCount": len(cluster_db_ids),
        "avgDistances": distances_dict,
        "clusterIds": cluster_db_ids
    }
    ensemble_db_id = db.ensemble.insert_one(ensemble_obj).inserted_id
    return ensemble_db_id

if __name__ == "__main__":
    main()  