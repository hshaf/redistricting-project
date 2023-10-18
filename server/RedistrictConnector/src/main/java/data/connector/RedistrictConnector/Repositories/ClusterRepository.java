package data.connector.RedistrictConnector.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import data.connector.RedistrictConnector.Models.Cluster;

public interface ClusterRepository extends MongoRepository <Cluster, String> {
    
    Optional<Cluster> findById(String id);

}
