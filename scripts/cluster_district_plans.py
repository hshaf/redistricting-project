import argparse
import json
import math
import multiprocessing as mp
import os
import re

import geopandas
from gerrychain import Partition, GeographicPartition, Graph
import matplotlib.pyplot as plt
import numpy as np
import sklearn.manifold
import sklearn.cluster

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
    plan_1_hash = hash(plan_1)
    plan_2_hash = hash(plan_2)
    return (plan_1_hash % 16) + ((plan_1_hash // 1024) % 16) + (plan_2_hash % 16) + ((plan_2_hash // 1024) % 16)

def calculate_optimal_transport_distance(plan_1: Partition, plan_2: Partition):
    return Pair(plan_1, plan_2).distance

def calculate_hamming_distance(plan_1: Partition, plan_2: Partition):
    return calculate_dummy_distance(plan_1, plan_2)

def calculate_distances_runner(prec_data_path: str,
                                prec_adj_path: str,
                                district_plan_files: list,
                                distance_func) -> np.array:
    graph = load_graph(prec_data_path, prec_adj_path)
    assign_dicts = load_assign_dicts(district_plan_files)
    
    # Determine district plan pairs and divide between workers
    num_plans = len(district_plan_files)
    pair_indices = list()
    for i in range(num_plans):
        for j in range(i + 1, num_plans):
            pair_indices.append((i, j))
    
    num_pairs = len(pair_indices)
    per_worker_pairs = list()
    for i in range(NUM_PROCESSES):
        start = (num_pairs // NUM_PROCESSES) * i + min(i, num_pairs % NUM_PROCESSES)
        end = (num_pairs // NUM_PROCESSES) * (i + 1) + min(i + 1, num_pairs % NUM_PROCESSES)
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
    for row in distance_matrix:
        print(",".join([str(n) for n in row]))

    # Normalize distances
    max_distance = distance_matrix.max()
    distance_matrix = distance_matrix / max_distance

    return distance_matrix

def calculate_distances_worker(args) -> list:
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

def compute_mds_points(distance_matrix: np.array) -> np.array:
    mds = sklearn.manifold.MDS(n_components=2, random_state=0, dissimilarity="precomputed", normalized_stress="auto")
    return mds.fit(distance_matrix).embedding_

def compute_kmeans_clusters(mds_points: np.array, return_elbow_plot: bool = False):
    output = dict()
    num_plans = mds_points.shape[0]
    for k in range(2, math.ceil(2 * math.sqrt(num_plans))):
        kmeans = sklearn.cluster.KMeans(n_clusters=k, n_init="auto", random_state=0)
        predictions = kmeans.fit_predict(mds_points).tolist()
        score = -1 * kmeans.score(mds_points)
        output[k] = {"score": score, "predictions": predictions, "cluster_centers": kmeans.cluster_centers_}
    
    if return_elbow_plot:
        plot_x = list(output.keys())
        plot_y = [partition["score"] for partition in output.values()]
        fig, ax = plt.subplots(figsize=(5,5))
        ax.plot(plot_x, plot_y)
        ax.scatter(plot_x, plot_y)
        return (output, fig)
    
    return output

def main():
    # Parse arguments
    parser = argparse.ArgumentParser(description="Use various distance metrics to cluster district plans")
    parser.add_argument("--state", default=None, help="the state for which precincts are generated, automatically populates other file paths")
    parser.add_argument("--prec-data-path", default=None, help="path to precinct data GeoJSON file")
    parser.add_argument("--prec-adj-path", default=None, help="path to edge list file")
    parser.add_argument("--plan-dir", default=None, required=True, help="directory containing generated district plans, used to automatically generate output file names")
    parser.add_argument("--distance-output", default=False, action="store_true", help="indicates that distance data should be computed and outputted to a file")
    distance_metric_options = ["optimal_transport", "hamming"]
    parser.add_argument("--distance-metric", default=None, required=True, choices=distance_metric_options, help="distance metric to be used")
    parser.add_argument("--cluster-output", default=False, action="store_true", help="indicates that cluster data should be created and outputted to files")

    args = vars(parser.parse_args())

    state = args["state"]
    if state:
        prec_data_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_precinct_data.json")
        prec_adj_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_adjacency_data.json")
    if args["prec_data_path"]:
        prec_data_path = args["prec_data_path"]
    if args["prec_adj_path"]:
        prec_adj_path = args["prec_adj_path"]
    plan_dir = os.path.join(DATA_BASE_DIRECTORY, args["plan_dir"])
    
    # Calculate distances
    if args["distance_output"]:
        # Find district plan files
        district_plan_files = sorted([os.path.join(plan_dir, file_name) for file_name in os.listdir(plan_dir) if re.fullmatch(r"\d\d\d\d\d.json", file_name)])

        # Select distance measure
        distance_func = calculate_optimal_transport_distance
        if args["distance_metric"] == "optimal_transport":
            distance_func = calculate_optimal_transport_distance
        elif args["distance_metric"] in "hamming":
            distance_func = calculate_hamming_distance

        # Calculate distances
        distance_matrix = calculate_distances_runner(prec_data_path=prec_data_path,
                                                        prec_adj_path=prec_adj_path,
                                                        district_plan_files=district_plan_files,
                                                        distance_func=distance_func
                                                    )
        np.savetxt(os.path.join(plan_dir, f"distance_{args['distance_metric']}.txt"), distance_matrix, delimiter=",")

    # Determine MDS points and clusters with k-means clustering
    if args["cluster_output"]:
        # Load distances matrix from file (if needed)
        if not args["distance_output"]:
            distance_file_path = os.path.join(plan_dir, f"distance_{args['distance_metric']}.txt")
            if os.path.isfile(distance_file_path):
                distance_matrix = np.loadtxt(distance_file_path, delimiter=",")
            else:
                print("--cluster-output flag was given, but distance calculation was not performed and no distance file exists")
                exit(-1)
        
        # Calculate clusters with incremental values of k
        mds_points = compute_mds_points(distance_matrix)
        cluster_partitions, k_score_plot = compute_kmeans_clusters(mds_points, return_elbow_plot=True)

        # Output to files
        mds_file_path = os.path.join(plan_dir, f"mds_points_{args['distance_metric']}.txt")
        clusters_file_path = os.path.join(plan_dir, f"clusters_{args['distance_metric']}.json")
        k_score_file_path = os.path.join(plan_dir, f"k_score_plot_{args['distance_metric']}.png")
        np.savetxt(mds_file_path, mds_points, delimiter=",")
        with open(clusters_file_path, mode="w", encoding="utf-8") as cluster_output_file:
            json.dump(cluster_partitions, cluster_output_file)
        k_score_plot.savefig(k_score_file_path)

if __name__ == "__main__":
    main()