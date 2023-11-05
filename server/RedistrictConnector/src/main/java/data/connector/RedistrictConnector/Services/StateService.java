package data.connector.RedistrictConnector.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import data.connector.RedistrictConnector.Repositories.StateRepository;
import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.EnsembleSummary;
import data.connector.RedistrictConnector.Models.State;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StateService {

    @Autowired
    private StateRepository stateRepository;

    public ResponseEntity<State> getStateByName(String name) {
        Optional<State> state = stateRepository.findByName(name);

        if (state.isPresent()) {
            return ResponseEntity.ok(state.get());
        }
        else {
            return ResponseEntity.notFound().build();
            //throw new ResourceNotFoundException("State not found with name : " + name);
        }
    }

    public String create(State state) {
        try {
            stateRepository.save(new State(state.getName(), new ArrayList<String>()));
            return "Added state " + state.getName() + " successfully";
        }
        catch (Exception e) {
            System.out.println(e);
            return "Failed to add state " + state.getName();
        }
    }

}
