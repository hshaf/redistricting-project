const states = ["AZ", "VA", "WI"];
const numEnsembles = 2;
const numClusters = 5;
const numDistricts = 5;

var output = {}

for (s of states) {
    var ensemblesDict = {};
    for (let i = 1; i <= numEnsembles; i++) {
        var ensemble = {};
        var clustersDict = {};
        ensemble["ensembleNum"] = i.toString();
        ensemble["name"] = s + " Ensemble " + i;
        for (let j = 1; j <= numClusters; j++) {
            var cluster = {};
            var plansDict = {};
            cluster["clusterNum"] = j.toString();
            cluster["count"] = 10 * Math.floor(20 * Math.random()) + 10;
            for (let k = 1; k <= numDistricts; k++) {
                var plan = {};
                plan["planNum"] = k.toString();
                plan["polsbyPopper"] = 0.3 + (0.2 * Math.random()) + 0.15 * (j % 3);
                plan["majMin"] = Math.floor(6 * Math.random()) + (j % 3);
                plan["partisanLean"] = Math.floor(5 * Math.random()) - 2 * (j % 2) - 1;
                plansDict[k] = plan;
            }
            cluster["plans"] = plansDict;

            cluster["polsbyPopper"] = Object.values(plansDict).map((x) => x["polsbyPopper"]).reduce((a, b) => a + b) / numDistricts;
            cluster["majMin"] = Object.values(plansDict).map((x) => x["majMin"]).reduce((a, b) => a + b) / numDistricts;
            cluster["partisanLean"] = Object.values(plansDict).map((x) => x["partisanLean"]).reduce((a, b) => a + b) / numDistricts;

            var distancesDict = {};
            distancesDict["optimalTransport"] = Math.random();
            distancesDict["hamming"] = Math.random();
            distancesDict["totalVariation"] = Math.random();
            cluster["distances"] = distancesDict;
            
            clustersDict[j] = cluster;
        }
        ensemble["clusters"] = clustersDict;
        ensemblesDict[i] = ensemble;
    }
    output[s] = ensemblesDict;
}

console.log(JSON.stringify(output, null, "\t"));