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

    @DBRef
    List<Cluster> clusters;

    public Ensemble() {}

    public Ensemble(String name, Integer totalDistrictCount,  Integer totalClusterCount, List<Cluster> clusters) {
        this.name = name;
        this.totalDistrictCount = totalDistrictCount;
        this.totalClusterCount = totalClusterCount;
        this.clusters = clusters;
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

    public List<Cluster> getClusters() {
        return clusters;
    }

    public void setClusters(List<Cluster> clusters) {
        this.clusters = clusters;
    }

    public Integer getTotalClusterCount(){
        return totalClusterCount;
    }

}
