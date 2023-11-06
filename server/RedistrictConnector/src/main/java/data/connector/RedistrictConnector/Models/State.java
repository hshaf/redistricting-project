package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class State {

    @Id
    private String initials;

    private String name;
    private String districtType;
    private List<String> ensembleIds;

    public State() {}

    public State(String initials, String name, String districtType, List<String> ensembleIds) {
        this.initials = initials;
        this.name = name;
        this.districtType = districtType;
        this.ensembleIds = ensembleIds;
    }

    public String getInitials() {
        return initials;
    }

    public String getName() {
        return name;
    }

    public String getDistrictType(){
        return districtType;
    }

    public List<String> getEnsembles() {
        return ensembleIds;
    }

    public void setEnsembles(List<String> ensembleIds) {
        this.ensembleIds = ensembleIds;
    }

}
