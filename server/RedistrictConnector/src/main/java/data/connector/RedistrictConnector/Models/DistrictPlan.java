package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class DistrictPlan {

    @Id
    private String id;
  
    private Double polsbyPopper;
    private Integer majMin;
    private Integer partisanLean;

    private String boundary;

    public DistrictPlan() {}

    public DistrictPlan(Double polsbyPopper, Integer majMin, Integer partisanLean) {
        this.polsbyPopper = polsbyPopper;
        this.majMin = majMin;
        this.partisanLean = partisanLean;
    }

    public String getId() {
        return id;
    }

    public Double getPolsbyPopper() {
        return polsbyPopper;
    }

    public Integer getMajMin() {
        return majMin;
    }

    public Integer getPartisanLean() {
        return partisanLean;
    }

    public String getBoundary(){
        return boundary;
    }

    public void setBoundary(String id){
        this.boundary = id;
    }
}
