package data.connector.RedistrictConnector.Models;

import org.springframework.data.annotation.Id;

public class District {

    @Id
    private String id;
  
    private Double polsbyPopper;
    private Integer majMin;
    private Integer partisanLean;

    // private Boundary boundary;

    public District() {}

    public District(Double polsbyPopper, Integer majMin, Integer partisanLean) {
        this.polsbyPopper = polsbyPopper;
        this.majMin = majMin;
        this.partisanLean = partisanLean;
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
}
