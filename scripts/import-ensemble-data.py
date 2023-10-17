import json
import requests
from constants import *

url = 'http://localhost:8080'

with open(ENSEMBLE_DATA_JSON) as fh:
    df = json.load(fh)

for state in df:
    stateName = state['name']
    object = {'name': stateName}
    x = requests.post(url+'/state/add', json = object)
    print(x.text)

    for ensemble in state['ensembles']:
        object = {'name': ensemble['name'], 'totalDistrictCount': ensemble['totalDistrictCount']}
        ensembleId = requests.post(url+'/ensemble/add/'+stateName, json=object).text
        print("Created ensemble with ObjectId : ", ensembleId)

        clusters = ensemble['clusters']
        for cluster in clusters:
            object = {
                "districtCount": cluster['districtCount'],
	            "polsbyPopper": cluster['polsbyPopper'],
	            "majMin": cluster['majMin'],
	            "partisanLean": cluster['partisanLean'],
	            "distances": cluster['distances']
            }
            clusterId = requests.post(url+'/cluster/add/'+ensembleId, json=object).text
            print('\tCreated cluster with ObjectId : ', clusterId)

            districts = cluster['districts']
            for district in districts:
                object = {
                    "polsbyPopper": district['polsbyPopper'],
	                "majMin": district['majMin'],
	                "partisanLean": district['partisanLean'],
                }
                districtId = requests.post(url+'/district/add/'+clusterId, json=object).text
                print('\t\tCreated district with ObjectId : ', districtId)