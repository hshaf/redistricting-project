import argparse
import json
import multiprocessing as mp
import os
import re

import geopandas
from gerrychain import Partition, GeographicPartition, Graph
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sklearn.manifold
import sklearn.cluster
import scipy.optimize

from OptimalTransport import Pair

DATA_BASE_DIRECTORY = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
NUM_PROCESSES = os.cpu_count()

def main():
    # Parse arguments
    parser = argparse.ArgumentParser(description="Use various distance metrics to cluster district plans")
    parser.add_argument("--state", default=None, help="the state for which precincts are generated, automatically populates other file paths")
    parser.add_argument("--prec-data-path", default=None, help="path to precinct data GeoJSON file")
    parser.add_argument("--prec-adj-path", default=None, help="path to edge list file")
    parser.add_argument("--plan-dir", default=None, required=True, help="directory containing generated district plans, used to automatically generate output file names")
    parser.add_argument("--distance-output", default=False, action="store_true", help="indicates that distance data should be computed and outputted to a file")
    distance_metric_options = ["optimal_transport", "hamming", "entropy"]
    parser.add_argument("--distance-metric", default=None, required=True, choices=distance_metric_options, help="distance metric to be used")
    parser.add_argument("--cluster-output", default=False, action="store_true", help="indicates that cluster data should be created and outputted to files")
    parser.add_argument("--num-procs", default=None, type=int, help="indicates the number of processing to use in worker pool, defaults to number of CPU cores if not specified")

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

    if args["num_procs"]:
        global NUM_PROCESSES
        NUM_PROCESSES = args["num_procs"]
    
    # Calculate distances
    if args["distance_output"]:
        # Find district plan files
        district_plan_files = sorted([os.path.join(plan_dir, file_name) for file_name in os.listdir(plan_dir) if re.fullmatch(r"\d\d\d\d\d.json", file_name)])

        # Select distance measure
        distance_func = calculate_optimal_transport_distance
        preproc_func = None
        if args["distance_metric"] == "optimal_transport":
            distance_func = calculate_optimal_transport_distance
        elif args["distance_metric"] in "hamming":
            distance_func = calculate_hamming_distance
            preproc_func = preproc_hamming_distance
        elif args["distance_metric"] in "entropy":
            distance_func = calculate_entropy_distance
            preproc_func = preproc_entropy_distance

        # Calculate distances
        distance_matrix = calculate_distances_runner(prec_data_path=prec_data_path,
                                                        prec_adj_path=prec_adj_path,
                                                        district_plan_files=district_plan_files,
                                                        distance_func=distance_func,
                                                        preproc_func=preproc_func
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
        cluster_groupings, k_score_plot, k_bic_plot = compute_kmeans_clusters(mds_points, return_plots=True)

        # Output to files
        mds_file_path = os.path.join(plan_dir, f"mds_points_{args['distance_metric']}.txt")
        clusters_file_path = os.path.join(plan_dir, f"clusters_{args['distance_metric']}.json")
        k_score_file_path = os.path.join(plan_dir, f"k_score_plot_{args['distance_metric']}.png")
        k_bic_file_path = os.path.join(plan_dir, f"k_bic_plot_{args['distance_metric']}.png")

        np.savetxt(mds_file_path, mds_points, delimiter=",")
        with open(clusters_file_path, mode="w", encoding="utf-8") as cluster_output_file:
            json.dump(cluster_groupings, cluster_output_file)
        k_score_plot.savefig(k_score_file_path)
        k_bic_plot.savefig(k_bic_file_path)

def load_graph(prec_data_path: str, prec_adj_path: str):
    precinct_df = geopandas.read_file(prec_data_path)
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

def calculate_dummy_distance(args):
    # Parse args
    (index_1, index_2), (_, assign_dicts) = args
    
    num_districts = len(set(assign_dicts[0].values()))
    plan_1_prec_counts = [0 for i in range(num_districts)]
    plan_2_prec_counts = [0 for i in range(num_districts)]
    for dist_assign in assign_dicts[index_1].values():
        plan_1_prec_counts[dist_assign - 1] += 1
    for dist_assign in assign_dicts[index_2].values():
        plan_2_prec_counts[dist_assign - 1] += 1

    distance_subtotal = 0
    for i in range(num_districts):
        distance_subtotal += (plan_1_prec_counts[i] - plan_2_prec_counts[i])**2
    distance = distance_subtotal**0.5
    
    return distance

def calculate_optimal_transport_distance(args):
    # Parse args
    (index_1, index_2), (graph, assign_dicts) = args

    plan_1 = Partition(graph=graph, assignment=assign_dicts[index_1])
    plan_2 = Partition(graph=graph, assignment=assign_dicts[index_2])

    return Pair(plan_1, plan_2).distance

def preproc_hamming_distance(graph: Graph, assign_dicts: list):
    nodes = graph.nodes()
    num_districts = len(set(assign_dicts[0].values()))
    num_plans = len(assign_dicts)
    
    hamming_bit_map = list()
    for i in range(num_plans):
        plan_bit_map = list()
        for dist_num in range(1, num_districts + 1): # District indices are 1-indexed
            district_bit_map = [(assign_dicts[i][n] == dist_num) for n in nodes]
            plan_bit_map.append(district_bit_map)
        hamming_bit_map.append(plan_bit_map)
    return np.array(hamming_bit_map, dtype=int)

def calculate_hamming_distance(args):
    # Parse args
    (index_1, index_2), plan_data = args

    # Find Hamming distance between district_i in plan_1 and district_j in plan_2 for all i, j
    # This is equal to the number of precincts such that (p in district_i) and (p not in district_j) or vice versa
    diff_matrix = np.matmul(plan_data[index_1], (1 - plan_data[index_2]).T) + np.matmul((1 - plan_data[index_1]), plan_data[index_2].T)

    # Find mapping between districts in plan_1 and districts in plan_2 that minimizes total distance
    opt_assign_indices = scipy.optimize.linear_sum_assignment(diff_matrix)
    total_diffs = diff_matrix[opt_assign_indices].sum() // 2
    
    return total_diffs

def preproc_entropy_distance(graph: Graph, assign_dicts: list):
    nodes = graph.nodes(data=True)

    # Create DataFrame where each column <n> gives the assignments of each precinct in plan <n>
    # Adapted from https://github.com/political-geometry/entropy
    plan_data = {"pop_total": dict()}
    for prec_id, prec_data in nodes:
        plan_data["pop_total"][prec_id] = prec_data["pop_total"]
    for i, a_dict in enumerate(assign_dicts):
        plan_dict = dict()
        for prec_id, dist_index in a_dict.items():
            plan_dict[prec_id] = dist_index
        plan_data[i] = plan_dict
    plan_prec_df = pd.DataFrame(data=plan_data)
    
    return plan_prec_df
    
def calculate_entropy_distance(args):
    # Parse args
    (index_1, index_2), plan_data = args

    # Calculate entropy
    # Adapted from https://github.com/political-geometry/entropy
    entropy = 0
    total_pop = plan_data["pop_total"].sum()
    district_county_intersections = plan_data.groupby(by=[index_1, index_2]).sum()
    district_2_populations = plan_data.groupby(by=index_2).sum()["pop_total"]
    for _, row in district_county_intersections.iterrows():
        if row["pop_total"] > 0:
            entropy += (1 / total_pop) * row["pop_total"] * np.log2(district_2_populations[row.name[1]] / row["pop_total"])
    
    return entropy

def calculate_distances_runner(prec_data_path: str,
                                prec_adj_path: str,
                                district_plan_files: list,
                                distance_func,
                                preproc_func) -> np.array:
    graph = load_graph(prec_data_path, prec_adj_path)
    assign_dicts = load_assign_dicts(district_plan_files)
    
    # Determine district plan pairs and divide between workers
    num_plans = len(district_plan_files)
    pair_indices = list()
    for i in range(num_plans):
        for j in range(i + 1, num_plans):
            pair_indices.append((i, j))
    
    # Perform preprocessing
    # plan_data object produced by a preprocessing function an be handled by the corresponding distance function
    # Otherwise, the graph and assign dicts are given, and Partitions can be generated from that
    if preproc_func is not None:
        plan_data = preproc_func(graph, assign_dicts)
    else:
        plan_data = (graph, assign_dicts)

    # Start worker pool
    # The argument to each distance function is given as ((index_1, index_2), plan_data)
    task_args = [(pair, plan_data) for pair in pair_indices]
    with mp.Pool(processes=NUM_PROCESSES) as p:
        distances = p.map(distance_func, task_args)

    # Organize distances into matrix
    distance_matrix = np.zeros((num_plans, num_plans), dtype=float)
    for (p1, p2), distance in zip(pair_indices, distances):
        distance_matrix[p1, p2] = distance
        distance_matrix[p2, p1] = distance

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
    # Normalize distances
    max_distance = distance_matrix.max()
    distance_matrix = distance_matrix / max_distance

    # Compute MDS
    mds = sklearn.manifold.MDS(n_components=2, random_state=0, dissimilarity="precomputed", normalized_stress="auto")
    return mds.fit(distance_matrix).embedding_

def bayesian_information_criterion(kmeans: sklearn.cluster.KMeans, mds_points: np.array):
    # Adapted from https://github.com/bobhancock/goxmeans/blob/master/doc/BIC_notes.pdf

    # n is the number of points, d is the dimension of each point
    n, d = mds_points.shape

    # Cluster count and size
    cl_size = np.bincount(kmeans.labels_)
    k = len(cl_size)
    # Square of the Euclidean distance of each point from its cluster center
    squared_distances = np.array([np.power(point - kmeans.cluster_centers_[lbl], 2).sum() for point, lbl in zip(mds_points, kmeans.labels_)])
    # Maximum likelihood estimate of variance
    variance = squared_distances.sum() / (n - k)

    model_invariant_term = 0.5 * k * np.log(n) * (d + 1)
    log_likelihood = (np.sum([cl_size[i] * np.log(cl_size[i]) for i in range(k)]) -
                        n * np.log(n) -
                        ((n * d) / 2) * np.log(2 * np.pi * variance) -
                        ((n - k) * d / 2))
    bic = -(log_likelihood - model_invariant_term)
    return bic

def compute_kmeans_clusters(mds_points: np.array, return_plots: bool = False):
    output = dict()
    num_plans = mds_points.shape[0]

    # Compute score, BIC, predictions, and cluster centers iterating through values of k
    for k in range(2, int(np.sqrt(num_plans)) + 1):
        kmeans = sklearn.cluster.KMeans(n_clusters=k, n_init="auto", random_state=0)
        predictions = kmeans.fit_predict(mds_points)
        score = -1 * kmeans.score(mds_points)
        bic = bayesian_information_criterion(kmeans, mds_points)
        output[k] = {"score": score, "bic": bic, "predictions": predictions.tolist(), "cluster_centers": kmeans.cluster_centers_.tolist()}
    
    # Generate plots if requested
    if return_plots:
        score_plot_x = list(output.keys())
        score_plot_y = [c["score"] for c in output.values()]
        score_fig, score_ax = plt.subplots(figsize=(5,5))
        score_ax.plot(score_plot_x, score_plot_y)
        score_ax.scatter(score_plot_x, score_plot_y)

        bic_plot_x = list(output.keys())
        bic_plot_y = [c["bic"] for c in output.values()]
        bic_fig, bic_ax = plt.subplots(figsize=(5,5))
        bic_ax.plot(bic_plot_x, bic_plot_y)
        bic_ax.scatter(bic_plot_x, bic_plot_y)
        
        return (output, score_fig, bic_fig)
    
    return output

if __name__ == "__main__":
    main()