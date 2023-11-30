import argparse
import json
import multiprocessing as mp
import os

import geopandas
from gerrychain import Partition, GeographicPartition, Graph
import numpy as np

from OptimalTransport import Pair

# Configuration variables
DATA_BASE_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
GEOPANDAS_ENGINE = "fiona"
NUM_PROCESSES = os.cpu_count()

def load_graph(prec_data_path: str, prec_adj_path: str):
    precinct_df = geopandas.read_file(prec_data_path, engine=GEOPANDAS_ENGINE)
    with open(prec_adj_path, mode="r", encoding="utf-8") as adj_data_file:
        edge_list = json.load(adj_data_file)
    graph = Graph(edge_list)
    graph.add_data(precinct_df.set_index("vtd_geo_id")[["pop_total"]])
    return graph

def load_assign_dicts(district_plan_files: list):
    output = list()
    for file in district_plan_files:
        with open(file, mode="r", encoding="utf-8") as f:
            assign_dict = json.load(f)
            output.append(assign_dict)
    return output

def calculate_dummy_distance(plan_1: Partition, plan_2: Partition):
    return hash(plan_1) / hash(plan_2)

def calculate_optimal_transport_distance(plan_1: Partition, plan_2: Partition):
    return Pair(plan_1, plan_2).distance

def calculate_hamming_distance(plan_1: Partition, plan_2: Partition):
    return hash(plan_1) / hash(plan_2)

def calculate_distances_runner(prec_data_path: str, 
                                prec_adj_path: str, 
                                district_plan_files: list, 
                                distance_func):
    graph = load_graph(prec_data_path, prec_adj_path)
    assign_dicts = load_assign_dicts(district_plan_files)
    
    # Determine district plan pairs and divide between workers
    num_plans = len(district_plan_files)
    pair_indices = list()
    for i in range(num_plans):
        for j in range(i + 1, num_plans):
            pair_indices.append((i, j))
    
    per_worker_pairs = list()
    for i in range(NUM_PROCESSES):
        start = (num_plans // NUM_PROCESSES) * i + min(i, num_plans % NUM_PROCESSES)
        end = (num_plans // NUM_PROCESSES) * (i + 1) + min(i + 1, num_plans % NUM_PROCESSES)
        per_worker_pairs.append(pair_indices[start:end])

    # Start worker pool
    worker_args = [(graph, assign_dicts, p, distance_func) for p in per_worker_pairs]
    with mp.Pool(processes=NUM_PROCESSES) as p:
        distances = p.map(calculate_distances_worker, worker_args)

    # Organize distances into matrix
    distance_matrix = np.zeros((num_plans, num_plans), dtype=float)
    for distance_list in distances:
        for p1, p2, distance in distance_list:
            distance_matrix[p1, p2] = distance
            distance_matrix[p2, p1] = distance
    #print(distance_matrix)

    # Normalize distances
    max_distance = distance_matrix.max()
    distance_matrix = distance_matrix / max_distance

    return distance_matrix

def calculate_distances_worker(args):
    # Parse args
    graph, district_plan_list, district_plan_pairs, distance_func = args

    # Determine the plans that will be accessed by this worker
    used_plan_indices = list()
    for pair in district_plan_pairs:
        used_plan_indices.append(pair[0])
        used_plan_indices.append(pair[1])
    used_plan_indices = set(used_plan_indices)

    plan_cache = dict()
    for plan_index in used_plan_indices:
        plan_cache[plan_index] = GeographicPartition(graph=graph, assignment=district_plan_list[plan_index])

    # Calculate distances
    output = list()
    for pair in district_plan_pairs:
        distance = distance_func(plan_cache[pair[0]], plan_cache[pair[1]])
        output.append((pair[0], pair[1], distance))
    return output

def main():
    # Parse arguments
    parser = argparse.ArgumentParser(description="Use various distance metrics to cluster district plans")
    parser.add_argument("--state", default=None, help="the state for which precincts are generated, automatically populates other file paths")
    parser.add_argument("--prec-data-path", default=None, help="path to precinct data GeoJSON file")
    parser.add_argument("--prec-adj-path", default=None, help="path to edge list file")
    parser.add_argument("--plan-dir", default=None, help="directory containing generated district plans")
    parser.add_argument("--distance-output-path", default=None, help="path to output distances")

    distance_metric_options = ["optimal_transport", "o", "hamming", "h"]
    parser.add_argument("--distance-metric", default=None, choices=distance_metric_options, help="distance metric to be used")

    args = vars(parser.parse_args())

    state = args["state"]
    if state:
        prec_data_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_precinct_data.json")
        prec_adj_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_adjacency_data.json")
    if args["prec_data_path"]:
        prec_data_path = args["prec_data_path"]
    if args["prec_adj_path"]:
        prec_adj_path = args["prec_adj_path"]
    if args["distance_output_path"]:
        distance_output_path = os.path.join(DATA_BASE_DIRECTORY, args["distance_output_path"])
    
    # Calculate distances (if option is selected)
    if args["distance_metric"]:
        # Determine plan directory
        if not args["plan_dir"]:
            print("--plan-dir must be specified when calculating distances")
            exit(-1)
        plan_dir = os.path.join(DATA_BASE_DIRECTORY, args["plan_dir"])
        district_plan_files = sorted(os.path.join(plan_dir, f) for f in os.listdir(plan_dir))

        # Select distance measure
        distance_func = calculate_optimal_transport_distance
        if args["distance_metric"] in ["o", "optimal_transport"]:
            distance_func = calculate_optimal_transport_distance

        # Calculate distances
        distance_matrix = calculate_distances_runner(prec_data_path=prec_data_path,
                                                        prec_adj_path=prec_adj_path,
                                                        district_plan_files=district_plan_files,
                                                        distance_func=distance_func
                                                    )

        if args["distance_output_path"]:
            np.savetxt(distance_output_path, distance_matrix, delimiter=",")

if __name__ == "__main__":
    main()