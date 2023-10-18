package data.connector.RedistrictConnector.Models;

import java.util.List;

public class EnsembleSummary {
    
    private Integer districtCount;
    private Integer clusterCount;
    private String name;
    private String ensembleId;
    // List<String> tagsPresent;

    public EnsembleSummary(Integer districtCount, Integer clusterCount, String name, String ensembleId){
        this.districtCount = districtCount;
        this.clusterCount = clusterCount;
        this.name = name;
        this.ensembleId = ensembleId;
    }
    public Integer getDistrictCount(){
        return districtCount;
    }

    public Integer getClusterCount(){
        return clusterCount;
    }

    public String getName(){
        return name;
    }

    public String getEnsembleId(){
        return ensembleId;
    }

}
