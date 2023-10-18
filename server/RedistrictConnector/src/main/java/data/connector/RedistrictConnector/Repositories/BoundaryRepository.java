package data.connector.RedistrictConnector.Repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import data.connector.RedistrictConnector.Models.Boundary;

public interface BoundaryRepository extends MongoRepository<Boundary, String> {

    Optional<Boundary> findById(String id);

}
