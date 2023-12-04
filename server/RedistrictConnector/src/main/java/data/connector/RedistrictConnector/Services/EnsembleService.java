package data.connector.RedistrictConnector.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.Ensemble;
import data.connector.RedistrictConnector.Models.EnsembleSummary;
import data.connector.RedistrictConnector.Models.State;
import data.connector.RedistrictConnector.Repositories.EnsembleRepository;
import data.connector.RedistrictConnector.Repositories.StateRepository;

@Service
public class EnsembleService {

    @Autowired
    EnsembleRepository ensembleRepository;

    @Autowired
    StateRepository stateRepository;

    public ResponseEntity<Ensemble> findById(String id) {
        Optional<Ensemble> ensemble = ensembleRepository.findById(id);

        if (ensemble.isPresent()) {
            return ResponseEntity.ok(ensemble.get());
        } else {
            return ResponseEntity.notFound().build();
            // throw new ResourceNotFoundException("Ensemble not found with id : " + id);
        }
    }

    public ResponseEntity<List<Ensemble>> getEnsembleList() {
        List<Ensemble> ensembles = ensembleRepository.findAll();
        return ResponseEntity.ok(ensembles);

    }

    public ResponseEntity<List<Ensemble>> getEnsembleList(String stateId) {
        Optional<State> state = stateRepository.findById(stateId);
        if (state.isPresent()) {
            if (!state.get().getEnsembles().isEmpty()) {
                List<Ensemble> ensembles = ensembleRepository.findAllById(state.get().getEnsembles());
                return ResponseEntity.ok(ensembles);
            }
            else{
                return ResponseEntity.notFound().build();
            }
        } 
        else {
            return ResponseEntity.notFound().build();
        }

    }

    public String create(Ensemble ensemble, String state) {
        try {
            Optional<State> stateObj = stateRepository.findByInitials(state);
            if (stateObj.isPresent()) {
                Ensemble newEnsemble = new Ensemble(ensemble.getName(), ensemble.getTotalDistrictPlanCount(),
                        ensemble.getTotalClusterCount(), new ArrayList<String>());
                ensembleRepository.save(newEnsemble);

                State stateUpdate = stateObj.get();
                List<String> ensembles = stateUpdate.getEnsembles();
                ensembles.add(newEnsemble.getId());
                stateUpdate.setEnsembles(ensembles);
                stateRepository.save(stateUpdate);
                return (newEnsemble.getId());
            } else {
                throw new ResourceNotFoundException("Failed to find state \'" + state + "\' to add ensemble to");
            }
        } catch (Exception e) {
            System.out.println(e);
            return "Failed to add ensemble to state with name : " + state;
        }
    }

}
