package data.connector.RedistrictConnector.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import data.connector.RedistrictConnector.Repositories.StateRepository;
import data.connector.RedistrictConnector.Models.State;
import java.util.List;

@Service
public class StateService {

    @Autowired
    private StateRepository stateRepository;

    public List<String> findByName(String name) {
        State state = stateRepository.findByName(name);
        return state.getEnsembles();
    }

}
