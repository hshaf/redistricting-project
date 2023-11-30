import sys
import os
import json

import geopandas
GEOPANDAS_ENGINE = "fiona"

precinct_file_path = sys.argv[1]
district_plan_dir_path = sys.argv[2]
output_dir_path = sys.argv[3]                                                                                                                                                                                           

district_plan_files = [f for f in os.listdir() if os.path.isfile(f)]

def main():
    precinct_df = geopandas.read_file(precinct_file_path, engine=GEOPANDAS_ENGINE)
    
    # Key is the precinct's vtd_geo_id, value is demographic metrics
    precinct_dict = {}

    # Populate precinct_dict
    for row in precinct_df.iterfeatures():
        precinct = row['properties']
        vtd_geo_id = precinct['vtd_geo_id']
        del precinct['vtd_geo_id']
        precinct_dict[vtd_geo_id] = precinct
    
    # Generate district summaries
    for file in district_plan_files:
        with open(file, mode='r', encoding='utf-8') as f:
            assign_dict = json.load(f)

        # Key is district assignment number, value is demographic metrics
        district_dict = {}

        # Populate district_dict by accumulating precincts into districts
        for vtd_geo_id, district_num in assign_dict.items():
            if district_num not in district_dict:
                district_dict[district_num] = precinct_dict[vtd_geo_id]
            else:
                current = district_dict[district_num]
                new = precinct_dict[vtd_geo_id]

                current['pop_total'] += new['pop_total']
                current['pop_white'] += new['pop_white']
                current['pop_black'] += new['pop_black']
                current['pop_native'] += new['pop_native']
                current['pop_asian'] += new['pop_asian']
                current['pop_pacific'] += new['pop_pacific']
                current['pop_two_or_more'] += new['pop_two_or_more']
                current['pop_hispanic'] += new['pop_hispanic']

                current['pop_total_18'] += new['pop_total_18']
                current['pop_white_18'] += new['pop_white_18']
                current['pop_black_18'] += new['pop_black_18']
                current['pop_native_18'] += new['pop_native_18']
                current['pop_asian_18'] += new['pop_asian_18']
                current['pop_pacific_18'] += new['pop_pacific_18']
                current['pop_two_or_more_18'] += new['pop_two_or_more_18']
                current['pop_hispanic_18'] += new['pop_hispanic_18']

                current['vote_dem'] += new['vote_dem']
                current['vote_rep'] += new['vote_rep']

                district_dict[district_num] = current

        # Process district plan demographics
        districts = {}
        for k, v in district_dict.items():
            districts[k] = {
                'vote_dem': district_dict['vote_dem'],
                'vote_rep': district_dict['vote_rep'],
                'winner': 'dem' if district_dict['vote_dem'] > district_dict['vote_rep'] else 'rep'
                }
        district_summary = {'maj_min': 0, districts: districts}
        threshold = 0.4 # Cutoff of white population for district to be considered majority-minority

        for district_num, data in district_dict.items():
            if data['pop_white'] / data['pop_total'] < threshold:
                district_summary['maj_min'] += 1
                # Need to change this to figure out which demographic is the majority

        out_file = open(output_dir_path + '/district_summary.json', 'w')
        json.dump(district_summary, out_file)

if __name__ == "__main__":
    main()  