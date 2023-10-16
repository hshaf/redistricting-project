package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class Cluster {

    @Id
    private String id;

    private String name;
    private List<String> tags;
    private Integer districtCount;

    @DBRef
    private List<District> districts;

    private Double polsbyPopper;
    private Double majMin;
    private Double partisanLean;
    private Distances distances;

    private String boundary;

    public Cluster() {};

    public Cluster(String name, List<String> tags, Integer districtCount, List<District> districts, Double polsbyPopper, Double majMin, Double partisanLean, Distances distances) {
        this.name = name;
        this.tags = tags;
        this.districtCount = districtCount;
        this.districts = districts;
        this.polsbyPopper = polsbyPopper;
        this.majMin = majMin;
        this.partisanLean = partisanLean;
        this.distances = distances;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
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

    public String getBoundary(){
        return boundary;
    }

    public void setBoundary(String boundaryId){
        this.boundary = boundaryId;
    }
}
