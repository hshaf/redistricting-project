package data.connector.RedistrictConnector.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import data.connector.RedistrictConnector.Repositories.StateRepository;
import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.State;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StateService {

    @Autowired
    private StateRepository stateRepository;

    public List<String> getEnsemblesByState(String name) {
        Optional<State> state = stateRepository.findByName(name);

        if (state.isPresent()) {
            return state.get().getEnsembles();
        }
        else {
            throw new ResourceNotFoundException("State not found with name : " + name);
        }
    }

    public String create(State state) {
        try {
            stateRepository.save(new State(state.getName(), new ArrayList<String>()));
            return "Added state successfully";
        }
        catch (Exception e) {
            System.out.println(e);
            return "Adding state failed";
        }
    }

}
