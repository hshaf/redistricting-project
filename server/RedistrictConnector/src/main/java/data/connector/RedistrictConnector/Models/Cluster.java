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

    private Integer maxRepublicanDistricts;
    private Integer minRepublicanDistricts;
    private Integer maxDemocraticDistricts;
    private Integer minDemocraticDistricts;
    private Double avgRepublicanDistricts;
    private Double avgDemocraticDistricts;

    private List<String> districtPlanIds;

    private Distances avgDistances;
    
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

    public AverageMajorities getAvgMajMinDistricts(){
        return this.avgMajMinDistricts;
    }

    public Distances getAvgDistances(){
        return this.avgDistances;
    }

    public Integer getMaxRepublicanDistricts(){
        return this.maxRepublicanDistricts;
    }

    public Integer getMinRepublicanDistricts(){
        return this.minRepublicanDistricts;
    }

    public Integer getMaxDemocraticDistricts(){
        return this.maxDemocraticDistricts;
    }

    public Integer getMinDemocraticDistricts(){
        return this.minDemocraticDistricts;
    }

    public Double getAvgRepublicanDistricts(){
        return this.avgRepublicanDistricts;
    }

    public Double getAvgDemocraticDistricts(){
        return this.avgDemocraticDistricts;
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
