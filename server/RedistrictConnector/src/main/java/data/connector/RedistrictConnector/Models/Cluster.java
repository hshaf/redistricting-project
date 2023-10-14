package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class Cluster {

    @Id
    private String id;

    private Integer districtCount;

    @DBRef
    private List<District> districts;

    private Double polsbyPopper;
    private Double majMin;
    private Double partisanLean;
    private Distances distances;

    // private Boundary boundary;

    public Cluster() {};

    public Cluster(Integer districtCount, List<District> districts, Double polsbyPopper, Double majMin, Double partisanLean, Distances distances) {
        this.districtCount = districtCount;
        this.districts = districts;
        this.polsbyPopper = polsbyPopper;
        this.majMin = majMin;
        this.partisanLean = partisanLean;
        this.distances = distances;
    }

    public Integer getDistrictCount() {
        return districtCount;
    }

    public List<District> getDistricts() {
        return districts;
    }

    public void setDistricts(List<District> districts) {
        this.districts = districts;
    }

    public Double getPolsbyPopper() {
        return polsbyPopper;
    }

    public Double getMajMin() {
        return majMin;
    }

    public Double getPartisanLean() {
        return partisanLean;
    }

    public Distances getDistances() {
        return distances;
    }
}
