package data.connector.RedistrictConnector.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Boundary;
import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Repositories.BoundaryRepository;
import data.connector.RedistrictConnector.Repositories.ClusterRepository;
import data.connector.RedistrictConnector.Repositories.DistrictRepository;

@Service
public class BoundaryService {

    @Autowired
    BoundaryRepository boundaryRepository;

    @Autowired
    DistrictRepository districtRepository;

    @Autowired
    ClusterRepository clusterRepository;

    public ResponseEntity<Boundary> findById(String id) {
        Optional<Boundary> boundary = boundaryRepository.findById(id);

        if (boundary.isPresent()) {
            return ResponseEntity.ok(boundary.get());
        } else {
            return ResponseEntity.notFound().build();
            // throw new ResourceNotFoundException("Boundary not found with id : " + id);
        }
    }

    public String create(Object data, String id) {
        try {
            Optional<District> district = districtRepository.findById(id);
            Optional<Cluster> cluster = clusterRepository.findById(id);
            if (district.isPresent()) {
                Boundary newBoundary = new Boundary(data);
                boundaryRepository.save(newBoundary);

                District districtUpdate = district.get();
                districtUpdate.setBoundary(newBoundary.getId());
                districtRepository.save(districtUpdate);
                return newBoundary.getId();
            } 
            else if(cluster.isPresent()){
                Boundary newBoundary = new Boundary(data);
                boundaryRepository.save(newBoundary);

                Cluster clusterUpdate = cluster.get();
                clusterUpdate.setBoundary(newBoundary.getId());
                clusterRepository.save(clusterUpdate);
                return newBoundary.getId();
            }
            else {
                throw new ResourceNotFoundException(
                        "Failed to find district \'" + id + "\' to add boundary to");
            }

        } catch (Exception e) {
            System.out.println(e);
            return "Failed to add boundary to district with id : " + id + e;
        }
    }

    public ResponseEntity<Boundary> findByDistrictId(String districtId) {
        try {
            Optional<District> district = districtRepository.findById(districtId);
            if (district.isPresent()) {

                Optional<Boundary> boundary = boundaryRepository.findById(district.get().getBoundary());
                if (boundary.isPresent()) {
                    return ResponseEntity.ok(boundary.get());

                } else {
                    return ResponseEntity.noContent().build();
                    // throw new ResourceNotFoundException("District \'" + districtId + "\' does not
                    // contain boundary data");
                }
            } else {
                return ResponseEntity.notFound().build();
                // throw new ResourceNotFoundException("Failed to find district \'" + districtId
                // + "\' to retrieve boundary from");
            }

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.notFound().build();
        }
    }
}
