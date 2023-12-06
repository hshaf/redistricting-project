import sys
import zipfile

import pymongo
from bson import json_util

def main():
    # Get data zip file
    if len(sys.argv) >= 2:
        file_path = sys.argv[1]
    else:
        print("Missing data file path")
        sys.exit(-1)

    # Load files into DB
    client = pymongo.MongoClient()
    db = client.redistricting

    file_collection_pairs = [
        ("redistricting.state.json", "state"),
        ("redistricting.ensemble.json", "ensemble"),
        ("redistricting.cluster.json", "cluster"),
        ("redistricting.district_plan.json", "districtPlan"),
        ("redistricting.boundary.json", "boundary")
    ]
    archive = zipfile.ZipFile(file=file_path, mode="r")
    for file, collection in file_collection_pairs:
        file_contents = archive.read(file).decode("utf-8")
        db[collection].insert_many(json_util.loads(file_contents))

if __name__ == "__main__":
    main()