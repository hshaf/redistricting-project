package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class Ensemble {
  
    @Id
    private String id;

    private String name;
    private Integer totalDistrictCount;

    @DBRef
    List<Cluster> clusters;

    public Ensemble() {}

    public Ensemble(String name, Integer totalDistrictCount, List<Cluster> clusters) {
        this.name = name;
        this.totalDistrictCount = totalDistrictCount;
        this.clusters = clusters;
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

}
