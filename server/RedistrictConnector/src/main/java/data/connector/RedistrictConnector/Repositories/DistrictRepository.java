package data.connector.RedistrictConnector.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import data.connector.RedistrictConnector.Models.District;

public interface DistrictRepository extends MongoRepository<District, String> {
    
    Optional<District> findById(String id);

}
