import matplotlib.pyplot as plt
from gerrychain import (GeographicPartition, Partition, Graph, MarkovChain,
                        proposals, updaters, constraints, accept, Election)
from gerrychain.proposals import recom
from gerrychain.tree import recursive_tree_part
from functools import partial
import pandas as pd
import geopandas

import json
import argparse
from constants import *

def main():
    # Parse arguments
    parser = argparse.ArgumentParser(description="Run ReCom to generate political district plans for a state")
    parser.add_argument("--prec-data-path", required=True)
    parser.add_argument("--prec-adj-path", required=True)
    parser.add_argument("--init-partition-path", required=True)
    parser.add_argument("--gen-init-partition", metavar="NUM_DISTRICTS", type=int)
    parser.add_argument("--output-folder")
    parser.add_argument("--num-plans", type=int)
    parser.add_argument("--num-procs", type=int)
    parser.add_argument("--pool_num", type=int)

    args = vars(parser.parse_args())

    # Select the action to take
    if args["gen-init-partition"] is None:
        if args["output-folder"] is None or args["num-plans"] is None or args["num-procs"] is None or args["num"] is None:
            parser.print_help()
        else:
            gen_district_plans(
                prec_data_path=args["prec-data-path"],
                prec_adj_path=args["prec-adj-path"],
                init_partition_path=args["initial-partition-path"],
                output_folder=args["output-folder"],
                num_plans=args["num-plans"],
                num_procs=args["num-procs"],
                pool_num=args["pool_num"]
            )
    else:
        gen_initial_partition(
            prec_data_path=args["prec-data-path"],
            prec_adj_path=args["prec-adj-path"],
            init_partition_path=args["initial-partition-path"],
            num_districts=args["gen-init-partition"]
        )

def gen_district_plans(prec_data_path: str, 
                        prec_adj_path: str, 
                        init_partition_path: str, 
                        output_folder: str, 
                        num_plans: int, 
                        num_procs: int, 
                        pool_num: int
                    ):
    # Load data files
    precinct_df = geopandas.read_file(prec_data_path)
    with open(prec_adj_path, mode="r", encoding="utf-8") as adj_data_file:
        edge_list = json.load(adj_data_file)
    with open(init_partition_path, mode="r", encoding="utf-8") as init_partition_file:
        assign_dict = json.load(init_partition_file)

    # Set configuration variables
    iters_per_plan = 10000
    epsilon = 0.05

    # Create graph
    graph = Graph(edge_list)
    graph.add_data(precinct_df[["pop_total"]].set_index("vtd_geo_id"))

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
                        epsilon=epsilon,
                        node_repeats=2
                    )

    # Create constraints on compactness and population differences
    compactness_bound = constraints.UpperBound(
                                        lambda p: len(p["cut_edges"]), 
                                        2 * len(curr_partition["cut_edges"])
                                    )
    pop_constraint = constraints.within_percent_of_ideal_population(curr_partition, epsilon)

    # Create district plans in a loop
    for plan_num in range(pool_num, num_plans, num_procs):
        # Run <iters_per_plan> iterations and get the partition at that stage
        chain = MarkovChain(
                    proposal=proposal,
                    constraints=[
                        pop_constraint,
                        compactness_bound
                    ],
                    accept=accept.always_accept,
                    initial_state=curr_partition,
                    total_steps=iters_per_plan
                )
        curr_partition = list([p for p in chain])[-1]

        # Save partition to file
        output_partition = dict()
        for i, subgraph in enumerate(curr_partition.subgraphs):
            for node in subgraph.nodes():
                output_partition[node] = i + 1
        with open(f"{output_folder}/{plan_num}.json", mode="w", encoding="utf-8") as output_file:
            json.dump(output_partition, output_file)

def gen_initial_partition(prec_data_path: str, prec_adj_path: str, init_partition_path: str, num_districts: int):
    # Load data files
    precinct_df = geopandas.read_file(prec_data_path)

    with open(prec_adj_path, mode="r", encoding="utf-8") as adj_data_file:
        edge_list = json.load(adj_data_file)

    # Create graph
    graph = Graph(edge_list)
    graph.add_data(precinct_df[["pop_total"]].set_index("vtd_geo_id"))

    # Attempt to create partition
    pop_target = precinct_df["pop_total"].sum() / num_districts
    assign_dict = recursive_tree_part(
                    graph=graph,
                    parts=range(1, num_districts + 1),
                    pop_target=pop_target,
                    pop_col="pop_total",
                    epsilon=0.05
                )

    with open(init_partition_path, mode="w", encoding="utf-8") as output_file:
        json.dump(assign_dict, output_file)


if __name__ == "__main__":
    main()