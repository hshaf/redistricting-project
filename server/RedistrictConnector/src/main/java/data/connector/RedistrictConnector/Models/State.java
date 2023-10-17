package data.connector.RedistrictConnector.Models;

import java.util.List;

import org.springframework.data.annotation.Id;

public class State {

    @Id
    private String name;
    private List<EnsembleSummary> ensembles;

    public State() {}

    public State(String name, List<EnsembleSummary> ensembles) {
        this.name = name;
        this.ensembles = ensembles;
    }

    public String getName() {
        return name;
    }

    public List<EnsembleSummary> getEnsembles() {
        return ensembles;
    }

    public void setEnsembles(List<EnsembleSummary> ensembles) {
        this.ensembles = ensembles;
    }

}
