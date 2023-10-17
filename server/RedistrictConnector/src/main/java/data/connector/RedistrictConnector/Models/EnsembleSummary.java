package data.connector.RedistrictConnector.Models;

import java.util.List;

public class EnsembleSummary {
    
    private int districtCount;
    private int clusterCount;
    private String name;
    private String ensembleId;
    // List<String> tagsPresent;

    public EnsembleSummary(int districtCount, int clusterCount, String name, String ensembleId){
        this.districtCount = districtCount;
        this.clusterCount = clusterCount;
        this.name = name;
        this.ensembleId = ensembleId;
    }
    public int getDistrictCount(){
        return districtCount;
    }

    public int getClusterCount(){
        return clusterCount;
    }

    public String getName(){
        return name;
    }

    public String getEnsembleId(){
        return ensembleId;
    }

}
