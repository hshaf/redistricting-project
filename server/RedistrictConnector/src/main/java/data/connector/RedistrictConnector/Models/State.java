package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class State {

    @Id
    private String name;
    private List<String> ensembleIds;

    public State() {}

    public State(String name, List<String> ensembleIds) {
        this.name = name;
        this.ensembleIds = ensembleIds;
    }

    public String getName() {
        return name;
    }

    public List<String> getEnsembles() {
        return ensembleIds;
    }

    public void setEnsembles(List<String> ensembleIds) {
        this.ensembleIds = ensembleIds;
    }

}
