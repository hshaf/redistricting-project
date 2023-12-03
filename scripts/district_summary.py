import sys
import os
import json
import re

import requests
import numpy as np
import pandas as pd
import geopandas

try:
    import pyogrio
except ImportError:
    GEOPANDAS_ENGINE = "fiona"
else:
    GEOPANDAS_ENGINE = "pyogrio"
URL = 'http://localhost:8080'                                                                                                                                                                                     

def main():
    # Process args
    precinct_file_path = sys.argv[1]
    ensemble_dir_path = sys.argv[2]
    state = sys.argv[3]
    ensemble_name = sys.argv[4]
    distance_metric = sys.argv[5]
    num_clusters = sys.argv[6]
    '''
    precinct_file_path = "../data/az_precinct_data.json"
    ensemble_dir_path = "../data/az_ensemble_test_0"
    state = "AZ"
    ensemble_name = "AZ Ensemble Test 1"
    distance_metric = "hamming"
    num_clusters = 2
    '''
    
    precinct_df = geopandas.read_file(precinct_file_path, engine=GEOPANDAS_ENGINE).set_index("vtd_geo_id")

    # Get district plan and cluster data
    district_plan_data = district_summary_data(precinct_df=precinct_df, ensemble_dir_path=ensemble_dir_path, distance_metric=distance_metric)
    cluster_data, cluster_assignments, centermost_plans, plans_to_render = cluster_summary_data(district_plan_data=district_plan_data,
                                                                                                ensemble_dir_path=ensemble_dir_path,
                                                                                                distance_metric=distance_metric,
                                                                                                num_clusters=num_clusters
                                                                                                )
    print(district_plan_data[0])
    print(cluster_data)
    # Create ensemble, clusters, and district plans in database
    ensemble_db_id = save_ensemble(state=state, name=ensemble_name, num_clusters=num_clusters, num_district_plans=len(district_plan_data))
    cluster_db_ids = save_clusters(cluster_data=cluster_data, ensemble_db_id=ensemble_db_id)
    district_plan_db_ids = save_district_plans(district_plan_data=district_plan_data, cluster_assignments=cluster_assignments, cluster_db_ids=cluster_db_ids)
    boundary_db_ids = save_boundaries(precinct_df=precinct_df, ensemble_dir_path=ensemble_dir_path, district_plan_db_ids=district_plan_db_ids, selected_indices=plans_to_render)
    
    # TODO: Fix this so it isn't hacky, should still work for now
    print(f"{centermost_plans} -> {[district_plan_db_ids[i] for i in centermost_plans]}")
    district_plan_files = sorted([os.path.join(ensemble_dir_path, f) for f in os.listdir(ensemble_dir_path) if re.fullmatch(r"\d\d\d\d\d.json", f)])
    for cluster_id, center_plan_index in zip(cluster_db_ids, centermost_plans):
        # Load district assignments
        with open(district_plan_files[center_plan_index], mode='r', encoding='utf-8') as f:
            assign_dict = json.load(f)
        precinct_df["district_assignment"] = pd.Series(data=assign_dict)
        
        # Create boundary by combining precincts into districts
        boundary = precinct_df[["geometry", "district_assignment"]].dissolve(by="district_assignment")

        # Store boundary
        res = requests.post(f"{URL}/boundary/add/{cluster_id}", json=boundary.to_json(), timeout=3000)
    #district_plan_db_ids = save_district_plans(district_plan_data)
    #cluster_db_ids = save_clusters(cluster_data, district_plan_db_ids)

def district_summary_data(precinct_df: geopandas.GeoDataFrame, ensemble_dir_path: list, distance_metric: str = None):
    district_plan_files = sorted([os.path.join(ensemble_dir_path, f) for f in os.listdir(ensemble_dir_path) if re.fullmatch(r"\d\d\d\d\d.json", f)])

    # Generate district summaries
    district_plan_data = list()
    if distance_metric is not None:
        mds_points = np.loadtxt(os.path.join(ensemble_dir_path, f"mds_points_{distance_metric}.txt"), delimiter=",")
    for i, file in enumerate(district_plan_files):
        with open(file, mode='r', encoding='utf-8') as f:
            assign_dict = json.load(f)

        # Populate district_dict by accumulating precincts into districts
        precinct_df["district_assignment"] = pd.Series(data=assign_dict)
        district_df = precinct_df.groupby("district_assignment").sum()

        # Process district plan data
        district_plan_entry = dict()

        dem_districts = (district_df['vote_dem'] > district_df['vote_rep']).sum()
        rep_districts = (district_df['vote_rep'] > district_df['vote_dem']).sum()
        district_plan_entry["partisanLean"] = (rep_districts - dem_districts).item()

        maj_black_districts = ((district_df['pop_black'] / district_df['pop_total']) >= 0.5)
        maj_asian_districts = ((district_df['pop_asian'] / district_df['pop_total']) >= 0.5)
        maj_native_districts = ((district_df['pop_native'] / district_df['pop_total']) >= 0.5)
        maj_pacific_districts = ((district_df['pop_pacific'] / district_df['pop_total']) >= 0.5)
        maj_hispanic_districts = ((district_df['pop_hispanic'] / district_df['pop_total']) >= 0.5)
        maj_min_districts = (maj_black_districts | maj_asian_districts | maj_native_districts | maj_pacific_districts | maj_hispanic_districts)
        district_plan_entry["majMinDistricts"] = {
            "totalMajMin": maj_min_districts.sum().item(),
            "majBlack": maj_black_districts.sum().item(),
            "majAsian": maj_asian_districts.sum().item(),
            "majNative": maj_native_districts.sum().item(),
            "majPacific": maj_pacific_districts.sum().item(),
            "majHispanic": maj_hispanic_districts.sum().item()
        }

        if distance_metric is not None:
            district_plan_entry["mdsCoords"] = mds_points[i].tolist()

        # Add district plan data to output
        district_plan_data.append(district_plan_entry)
    
    return district_plan_data

def cluster_summary_data(district_plan_data: list, ensemble_dir_path: str, distance_metric: str, num_clusters: int):
    with open(os.path.join(ensemble_dir_path, f"clusters_{distance_metric}.json"), mode='r', encoding='utf-8') as f:
        cluster_grouping_data = json.load(f)
    cluster_grouping = cluster_grouping_data[str(num_clusters)]

    # Create cluster entries, fill in cluster center data
    cluster_data = list()
    for i, coords in enumerate(cluster_grouping["cluster_centers"]):
        cluster_entry = {
            "districtPlanIndices": [],
            "districtPlanCount": 0,
            "mdsCoords": coords,
            "partisanLean": 0,
            "distances": { # TODO: Fill in the correct distance measures
                "optimalTransport": None,
                "hamming": None,
                "totalVariation": None
            },
            "majMinDistricts": {
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
        cluster_data[cluster_assignment]["districtPlanIndices"].append(district_index)

        cluster_data[cluster_assignment]["partisanLean"] += district_plan_data[district_index]["partisanLean"]
        cluster_data[cluster_assignment]["majMinDistricts"]["totalMajMin"] += district_plan_data[district_index]["majMinDistricts"]["totalMajMin"]
        cluster_data[cluster_assignment]["majMinDistricts"]["majBlack"] += district_plan_data[district_index]["majMinDistricts"]["majBlack"]
        cluster_data[cluster_assignment]["majMinDistricts"]["majAsian"] += district_plan_data[district_index]["majMinDistricts"]["majAsian"]
        cluster_data[cluster_assignment]["majMinDistricts"]["majNative"] += district_plan_data[district_index]["majMinDistricts"]["majNative"]
        cluster_data[cluster_assignment]["majMinDistricts"]["majPacific"] += district_plan_data[district_index]["majMinDistricts"]["majPacific"]
        cluster_data[cluster_assignment]["majMinDistricts"]["majHispanic"] += district_plan_data[district_index]["majMinDistricts"]["majHispanic"]

    for i in range(num_clusters):
        cluster_data[i]["districtPlanCount"] = len(cluster_data[i]["districtPlanIndices"])
        cluster_data[i]["partisanLean"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["majMinDistricts"]["totalMajMin"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["majMinDistricts"]["majBlack"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["majMinDistricts"]["majAsian"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["majMinDistricts"]["majNative"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["majMinDistricts"]["majPacific"] /= cluster_data[i]["districtPlanCount"]
        cluster_data[i]["majMinDistricts"]["majHispanic"] /= cluster_data[i]["districtPlanCount"]

    # Determine average value for each distance measure
    distance_measures = [
        ("optimal_transport", "optimalTransport"),
        ("hamming", "hamming"),
    ]
    for distance_measure_name, distance_measure_key in distance_measures:
        if os.path.isfile(os.path.join(ensemble_dir_path, f"distance_{distance_measure_name}.txt")):
            with open(os.path.join(ensemble_dir_path, f"distance_{distance_measure_name}.txt")) as distance_file:
                distances = np.loadtxt(distance_file, delimiter=",")
                for i in range(num_clusters):
                    cluster_plan_indices = cluster_data[i]["districtPlanIndices"]
                    # TODO: Double check to see if 0 values on diagonal should be included
                    # If not, do .sum() / (len(cluster_plan_indices) - 1) * len(cluster_plan_indices))
                    avgPairDistance = distances[cluster_plan_indices][:, cluster_plan_indices].mean()
                    cluster_data[i]["distances"][distance_measure_key] = avgPairDistance

    # Identify district plans in each cluster closest to the center
    centermost_plans = list()
    for i in range(num_clusters):
        cluster_center = cluster_data[i]["mdsCoords"]
        closest_district_index = cluster_data[i]["districtPlanIndices"][0]
        for j in range(1, cluster_data[i]["districtPlanCount"]):
            curr_district_index = cluster_data[i]["districtPlanIndices"][j]
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

def db_setup():
    state_data = [
        {"initials": "AZ", "name": "Arizona", "districtPlanType": "State Assembly"},
        {"initials": "VA", "name": "Virginia", "districtPlanType": "State Assembly"},
        {"initials": "WI", "name": "Wisconsin", "districtPlanType": "State Senate"},
    ]
    for s in state_data:
        state_obj = {
            "initials": s["initials"],
            "name": s["name"],
            "districtType": s["districtPlanType"], # TODO: Change key name to districtPlanType when server is updated
            "ensembleIds": []
        }
        requests.post(f"{URL}/state/add/", json=state_obj, timeout=3000)

def save_ensemble(state: str, name: str, num_clusters: int, num_district_plans: int):
    # Save ensemble to database and record the database ID
    ensemble_obj = {
        "state": state,
        "name": name,
        "totalDistrictCount": num_district_plans, # TODO: Change key name to totalDistrictPlanCount when server is updated
        "totalClusterCount": num_clusters
    }
    res = requests.post(f"{URL}/ensemble/add/{state}", json=ensemble_obj, timeout=3000)
    return res.text

def save_clusters(cluster_data: list, ensemble_db_id: str):
    # Save each cluster to the database and record the database ID for each
    output = list()
    for entry in cluster_data:
        # TODO: Remove name changing after server is changed
        entry["districtCount"] = entry["districtPlanCount"]
        del entry["districtPlanCount"]
        
        # TODO: Fix formatting of majMin after server is changed
        entry["majMin"] = entry["majMinDistricts"]["totalMajMin"]
        del entry["majMinDistricts"]

        res = requests.post(f"{URL}/cluster/add/{ensemble_db_id}", json=entry, timeout=3000)
        output.append(res.text)
    return output

def save_district_plans(district_plan_data: list, cluster_assignments: list, cluster_db_ids: list):
    # Save each district plan to the database and record the database ID for each
    output = list()
    for entry, cluster_index in zip(district_plan_data, cluster_assignments):
        # TODO: Fix formatting of majMin after server is changed
        entry["majMin"] = entry["majMinDistricts"]["totalMajMin"]
        del entry["majMinDistricts"]

        res = requests.post(f"{URL}/district/add/{cluster_db_ids[cluster_index]}", json=entry, timeout=3000)
        output.append(res.text)
    return output    

def save_boundaries(precinct_df: geopandas.GeoDataFrame, ensemble_dir_path: list, district_plan_db_ids: list, selected_indices: list):
    district_plan_files = sorted([os.path.join(ensemble_dir_path, f) for f in os.listdir(ensemble_dir_path) if re.fullmatch(r"\d\d\d\d\d.json", f)])

    # Generate district boundaries
    boundary_db_ids = list()
    for i in selected_indices:
        # Load district assignments
        with open(district_plan_files[i], mode='r', encoding='utf-8') as f:
            assign_dict = json.load(f)
        precinct_df["district_assignment"] = pd.Series(data=assign_dict)
        
        # Create boundary by combining precincts into districts
        boundary = precinct_df[["geometry", "district_assignment"]].dissolve(by="district_assignment")

        # Save to database
        res = requests.post(f"{URL}/boundary/add/{district_plan_db_ids[i]}", json=boundary.to_json(), timeout=3000)
        boundary_db_ids.append(res.text)
    return boundary_db_ids

if __name__ == "__main__":
    main()  