package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class State {

    @Id
    private String initials;

    private String name;
    private String districtPlanType;
    private String stateBoundary;
    private String currDistrictPlanBoundary;
    private List<Double> mapCenter;
    private Integer mapZoom;
    private List<List<Integer>> ensembleClusterAssociation;
    private List<String> ensembleIds;

    private Double percentRepublicanVoters;
    private Double percentDemocraticVoters;
    private Demographics demographics;

    public State() {}

    public State(String initials, String name, String districtType, List<String> ensembleIds) {
        this.initials = initials;
        this.name = name;
        this.districtPlanType = districtType;
        this.ensembleIds = ensembleIds;
        stateBoundary = null;
        currDistrictPlanBoundary = null;
    }

    public String getInitials() {
        return initials;
    }

    public String getName() {
        return name;
    }

    public Double getPercentRepublicanVoters(){
        return this.percentRepublicanVoters;
    }

    public Double getPercentDemocraticVoters(){
        return this.percentDemocraticVoters;
    }

    public Demographics getDemographics(){
        return this.demographics;
    }

    public String getDistrictPlanType(){
        return districtPlanType;
    }

    public List<String> getEnsembles() {
        return ensembleIds;
    }

    public void setEnsembles(List<String> ensembleIds) {
        this.ensembleIds = ensembleIds;
    }

    public String getStateBoundary(){
        return this.stateBoundary;
    }

    public void setStateBoundary(String stateBoundary){
        this.stateBoundary = stateBoundary;
    }

    public String getCurrDistrictPlanBoundary(){
        return this.currDistrictPlanBoundary;
    }

    public void setCurrDistrictPlanBoundary(String currDistrictPlanBoundary){
        this.currDistrictPlanBoundary = currDistrictPlanBoundary;
    }

    public List<Double> getMapCenter(){
        return this.mapCenter;
    }

    public Integer getMapZoom(){
        return mapZoom;
    }

    public List<List<Integer>> getEnsembleClusterAssociation(){
        return this.ensembleClusterAssociation;
    }

}
