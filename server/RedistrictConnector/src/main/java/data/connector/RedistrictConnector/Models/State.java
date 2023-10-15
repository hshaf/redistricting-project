package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class State {

    @Id
    private String name;
    private List<String> ensembles;

    public State() {}

    public State(String name, List<String> ensembles) {
        this.name = name;
        this.ensembles = ensembles;
    }

    public String getName() {
        return name;
    }

    public List<String> getEnsembles() {
        return ensembles;
    }

    public void setEnsembles(List<String> ensembles) {
        this.ensembles = ensembles;
    }

}
