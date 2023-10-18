package data.connector.RedistrictConnector.Repositories;

import java.util.Optional;

import data.connector.RedistrictConnector.Models.State;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateRepository extends MongoRepository<State, String> {

    Optional<State> findByName(String name);
    
}
