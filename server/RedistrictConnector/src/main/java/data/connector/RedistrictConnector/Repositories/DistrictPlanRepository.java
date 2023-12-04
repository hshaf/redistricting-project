package data.connector.RedistrictConnector.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import data.connector.RedistrictConnector.Models.DistrictPlan;

public interface DistrictPlanRepository extends MongoRepository<DistrictPlan, String> {
    
    Optional<DistrictPlan> findById(String id);

}
