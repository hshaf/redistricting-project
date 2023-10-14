package data.connector.RedistrictConnector.Repositories;

import data.connector.RedistrictConnector.Models.State;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateRepository extends MongoRepository<State, String> {

    State findByName(String name);
    
}
