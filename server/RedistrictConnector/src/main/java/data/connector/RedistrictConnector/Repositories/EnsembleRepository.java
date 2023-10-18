package data.connector.RedistrictConnector.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import data.connector.RedistrictConnector.Models.Ensemble;

public interface EnsembleRepository extends MongoRepository<Ensemble, String> {
    
    Optional<Ensemble> findById(String id);

}
