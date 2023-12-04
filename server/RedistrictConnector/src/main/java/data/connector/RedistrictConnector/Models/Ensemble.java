package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class Ensemble {
  
    @Id
    private String id;

    private String name;
    private Integer totalDistrictPlanCount;
    private Integer totalClusterCount;
    private Distances avgDistances;
    
    List<String> clusterIds;

    public Ensemble() {}

    public Ensemble(String name, Integer totalDistrictCount,  Integer totalClusterCount, List<String> clusterIds) {
        this.name = name;
        this.totalDistrictPlanCount = totalDistrictCount;
        this.totalClusterCount = totalClusterCount;
        this.clusterIds = clusterIds;
    }

    public String getId() {
        return id;
    }

    public Distances getAvgDistances(){
        return this.avgDistances;
    }

    public String getName() {
        return name;
    }

    public Integer getTotalDistrictCount() {
        return totalDistrictPlanCount;
    }

    public List<String> getClusters() {
        return clusterIds;
    }

    public void setClusters(List<String> clusterIds) {
        this.clusterIds = clusterIds;
    }

    public Integer getTotalClusterCount(){
        return totalClusterCount;
    }

}
