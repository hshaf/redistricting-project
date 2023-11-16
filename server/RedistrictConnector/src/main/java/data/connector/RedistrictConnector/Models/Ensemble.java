package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class Ensemble {
  
    @Id
    private String id;

    private String name;
    private Integer totalDistrictCount;
    private Integer totalClusterCount;

    
    List<String> clusterIds;

    public Ensemble() {}

    public Ensemble(String name, Integer totalDistrictCount,  Integer totalClusterCount, List<String> clusterIds) {
        this.name = name;
        this.totalDistrictCount = totalDistrictCount;
        this.totalClusterCount = totalClusterCount;
        this.clusterIds = clusterIds;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getTotalDistrictCount() {
        return totalDistrictCount;
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
