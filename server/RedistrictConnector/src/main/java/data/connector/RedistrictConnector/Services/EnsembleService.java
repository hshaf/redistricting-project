package data.connector.RedistrictConnector.Services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.Ensemble;
import data.connector.RedistrictConnector.Repositories.EnsembleRepository;

@Service
public class EnsembleService {
    
    @Autowired
    EnsembleRepository ensembleRepository;

    public Ensemble findById(String id) {
        Optional<Ensemble> ensemble = ensembleRepository.findById(id);

        if (ensemble.isPresent()) {
            return ensemble.get();
        }
        else {
            throw new ResourceNotFoundException("Ensemble not found with id : " + id);
        }
    }

    public String create(Ensemble ensemble) {
        try {
            ensembleRepository.save(new Ensemble(ensemble.getName(), ensemble.getTotalDistrictCount(), new ArrayList<Cluster>()));
            return "Added ensemble successfully";
        }
        catch (Exception e) {
            return "Adding ensemble failed";
        }
    }

}
