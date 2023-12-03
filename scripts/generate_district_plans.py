import os
import json
import argparse
from functools import partial

from gerrychain import (GeographicPartition, Graph, MarkovChain, updaters, constraints, accept)
from gerrychain.random import random
from gerrychain.proposals import recom
from gerrychain.tree import recursive_tree_part
import geopandas

DATA_BASE_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
STEPS_PER_PLAN = 10000
EPSILON = 0.05
GEOPANDAS_ENGINE = "pyogrio"

def main():
    # Configuration variables
    try:
        import pyogrio
    except ImportError:
        global GEOPANDAS_ENGINE
        GEOPANDAS_ENGINE = "fiona"

    # Parse arguments
    parser = argparse.ArgumentParser(description="Run ReCom to generate political district plans for a state")
    parser.add_argument("--state", default=None, help="the state for which precincts are generated, automatically populates other file paths")
    parser.add_argument("--prec-data-path", default=None, help="path to precinct data GeoJSON file")
    parser.add_argument("--prec-adj-path", default=None, help="path to edge list file")
    parser.add_argument("--init-partition-path", default=None, help="path to file containing initial partition")
    parser.add_argument("--gen-init-partition", metavar="NUM_DISTRICTS", type=int, default=None, help="select flag to generate a partition with NUM_DISTRICTS districts")
    parser.add_argument("--output-folder", default=None, help="path to folder to store generated district plans")
    parser.add_argument("--num-plans", type=int, default=None, help="total number of plans across all parallel processes")
    parser.add_argument("--num-procs", type=int, default=None, help="total number of parallel processes, defaults to 1 if not specified")
    parser.add_argument("--pool-num", type=int, default=None, help="process number in GNU Parallel, defaults to 0 if not specified")

    args = vars(parser.parse_args())

    state = args["state"]
    if state:
        prec_data_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_precinct_data.json")
        prec_adj_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_adjacency_data.json")
        init_partition_path = os.path.join(DATA_BASE_DIRECTORY, f"{state}_init_partition.json")

    if args["prec_data_path"]:
        prec_data_path = args["prec_data_path"]
    if args["prec_adj_path"]:
        prec_adj_path = args["prec_adj_path"]
    if args["init_partition_path"]:
        init_partition_path = args["init_partition_path"]
    if args["output_folder"]:
        output_folder = os.path.join(DATA_BASE_DIRECTORY, args["output_folder"])

    if prec_data_path is None or prec_adj_path is None or init_partition_path is None :
        parser.print_help()

    # Select the action to take
    if args["gen_init_partition"] is None:
        if output_folder is None or args["num_plans"] is None:
            parser.print_help()
        else:
            if args["num_procs"] is None:
                args["num_procs"] = 1
            if args["pool_num"] is None:
                args["pool_num"] = 0
            gen_district_plans(
                prec_data_path=prec_data_path,
                prec_adj_path=prec_adj_path,
                init_partition_path=init_partition_path,
                output_folder=output_folder,
                num_plans=args["num_plans"],
                num_procs=args["num_procs"],
                pool_num=args["pool_num"]
            )
    else:
        gen_initial_partition(
            prec_data_path=prec_data_path,
            prec_adj_path=prec_adj_path,
            init_partition_path=init_partition_path,
            num_districts=args["gen_init_partition"]
        )

def gen_district_plans(prec_data_path: str,
                        prec_adj_path: str,
                        init_partition_path: str,
                        output_folder: str,
                        num_plans: int,
                        num_procs: int,
                        pool_num: int
                    ):
    """
    Adapted from https://gerrychain.readthedocs.io/en/latest/user/recom.html
    """

    # Load data files
    precinct_df = geopandas.read_file(prec_data_path, engine=GEOPANDAS_ENGINE)
    with open(prec_adj_path, mode="r", encoding="utf-8") as adj_data_file:
        edge_list = json.load(adj_data_file)
    with open(init_partition_path, mode="r", encoding="utf-8") as init_partition_file:
        assign_dict = json.load(init_partition_file)

    # Other initialization
    os.makedirs(output_folder, exist_ok=True)   # Create output folder if it does not exist
    random.seed(f"{output_folder}_{pool_num}")  # Set random seed

    # Create graph
    graph = Graph(edge_list)
    graph.add_data(precinct_df.set_index("vtd_geo_id")[["pop_total"]])

    # Create population updater, for computing how close to equality the district populations are.
    my_updaters = {"population": updaters.Tally("pop_total", alias="population")}

    # Create initial partition
    curr_partition = GeographicPartition(graph, assignment=assign_dict, updaters=my_updaters)

    # The ReCom proposal needs to know the ideal population for the districts so that
    # we can improve speed by bailing early on unbalanced partitions.

    ideal_population = sum(curr_partition["population"].values()) / len(curr_partition)

    # We use functools.partial to bind the extra parameters (pop_col, pop_target, epsilon, node_repeats)
    # of the recom proposal.
    proposal = partial(recom,
                        pop_col="pop_total",
                        pop_target=ideal_population,
                        epsilon=EPSILON,
                        node_repeats=2
                    )

    # Create constraints on compactness and population differences
    compactness_bound = constraints.UpperBound(
                                        lambda p: len(p["cut_edges"]),
                                        2 * len(curr_partition["cut_edges"])
                                    )
    pop_constraint = constraints.within_percent_of_ideal_population(curr_partition, EPSILON)

    # Create district plans in a loop
    for plan_num in range(pool_num, num_plans, num_procs):
        # Run <STEPS_PER_PLAN> iterations and get the partition at that stage
        chain = MarkovChain(
                    proposal=proposal,
                    constraints=[
                        pop_constraint,
                        compactness_bound
                    ],
                    accept=accept.always_accept,
                    initial_state=curr_partition,
                    total_steps=STEPS_PER_PLAN
                )
        curr_partition = list(chain)[-1]

        # Save partition to file
        output_partition = dict()
        for i, subgraph in enumerate(curr_partition.subgraphs):
            for node in subgraph.nodes():
                output_partition[node] = i + 1
        with open(f"{output_folder}/{str(plan_num).rjust(5, '0')}.json", mode="w", encoding="utf-8") as output_file:
            json.dump(output_partition, output_file)

def gen_initial_partition(prec_data_path: str, prec_adj_path: str, init_partition_path: str, num_districts: int):
    # Load data files
    precinct_df = geopandas.read_file(prec_data_path, engine=GEOPANDAS_ENGINE)

    with open(prec_adj_path, mode="r", encoding="utf-8") as adj_data_file:
        edge_list = json.load(adj_data_file)

    # Create graph
    graph = Graph(edge_list)
    graph.add_data(precinct_df.set_index("vtd_geo_id")[["pop_total"]])

    # Attempt to create partition
    pop_target = precinct_df["pop_total"].sum() / num_districts
    assign_dict = recursive_tree_part(
                    graph=graph,
                    parts=range(1, num_districts + 1),
                    pop_target=pop_target,
                    pop_col="pop_total",
                    epsilon=EPSILON
                )

    with open(init_partition_path, mode="w", encoding="utf-8") as output_file:
        json.dump(assign_dict, output_file)

if __name__ == "__main__":
    main()