package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

public class Cluster {

    @Id
    private String id;

    private String name;
    private List<String> tags;
    private Integer districtPlanCount;
    private List<Double> clusterCenter;

    
    private List<String> districtPlanIds;

    private Double avgPartisanLean;
    private AverageMajorities avgMajMinDistricts;
    private String boundary;

    public Cluster() {};

    public Cluster(String name, List<String> tags, Integer districtCount, List<String> districtIds) {
        this.name = name;
        this.tags = tags;
        this.districtPlanCount = districtCount;
        this.districtPlanIds = districtIds;
    }

    public List<Double> getClusterCenter(){
        return this.clusterCenter;
    }

    public Double getAvgPartisanLean(){
        return this.avgPartisanLean;
    }

    public AverageMajorities getAvgMajMinDistricts(){
        return this.avgMajMinDistricts;
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

    public Integer getDistrictPlanCount() {
        return districtPlanCount;
    }

    public List<String> getDistricts() {
        return districtPlanIds;
    }

    public void setDistricts(List<String> districtIds) {
        this.districtPlanIds = districtIds;
    }


    public String getBoundary(){
        return boundary;
    }

    public void setBoundary(String boundaryId){
        this.boundary = boundaryId;
    }
}
