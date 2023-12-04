package data.connector.RedistrictConnector.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import data.connector.RedistrictConnector.Repositories.StateRepository;
import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.EnsembleSummary;
import data.connector.RedistrictConnector.Models.State;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class StateService {

    @Autowired
    private StateRepository stateRepository;

    public ResponseEntity<State> getStateByInitials(String initials) {
        Optional<State> state = stateRepository.findByInitials(initials);

        if (state.isPresent()) {
            return ResponseEntity.ok(state.get());
        }
        else {
            return ResponseEntity.notFound().build();
            //throw new ResourceNotFoundException("State not found with name : " + name);
        }
    }

    public ResponseEntity<HashMap<String,String>> getStateInfo(){
        List<State> states = stateRepository.findAll();
        HashMap<String,String> ret = new HashMap<String,String>();
        for (State state : states) {
            ret.put(state.getName(), state.getInitials());
        }
        return ResponseEntity.ok(ret);
    }

    public String create(State state) {
        try {
            stateRepository.save(new State(state.getInitials(), state.getName(), state.getDistrictPlanType(), new ArrayList<String>()));
            return "Added state " + state.getName() + " successfully";
        }
        catch (Exception e) {
            System.out.println(e);
            return "Failed to add state " + state.getName();
        }
    }

}
