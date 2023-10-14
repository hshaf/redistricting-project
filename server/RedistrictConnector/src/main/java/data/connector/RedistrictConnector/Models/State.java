package data.connector.RedistrictConnector.Models;

import java.util.List;
import org.springframework.data.annotation.Id;

public class State {

    @Id
    private String id;

    private String name;
    private List<String> ensembles;

    public String getName() {
        return name;
    }

    public List<String> getEnsembles() {
        return ensembles;
    }

}
