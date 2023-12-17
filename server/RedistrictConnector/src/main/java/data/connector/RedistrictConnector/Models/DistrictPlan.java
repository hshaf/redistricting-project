package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class DistrictPlan {

    @Id
    private String id;
  
    private List<Double> mdsCoords;
    private Majorities majMinDistricts;
    private Integer numRepublicanDistricts;
    private Integer numDemocraticDistricts;

    private String boundary;

    public DistrictPlan() {}

    

    public String getId() {
        return id;
    }

   public List<Double> getMdsCoords(){
    return this.mdsCoords;
   }

    public Majorities getMajMinDistricts() {
        return this.majMinDistricts;
    }

    public Integer getNumRepublicanDistricts() {
        return this.numRepublicanDistricts;
    }

    public Integer getNumDemocraticDistricts() {
        return this.numDemocraticDistricts;
    }

    public String getBoundary(){
        return boundary;
    }

    public void setBoundary(String id){
        this.boundary = id;
    }
}
