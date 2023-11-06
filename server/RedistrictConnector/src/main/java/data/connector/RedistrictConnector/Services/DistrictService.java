package data.connector.RedistrictConnector.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Repositories.ClusterRepository;
import data.connector.RedistrictConnector.Repositories.DistrictRepository;

@Service
public class DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private ClusterRepository clusterRepository;

    public ResponseEntity<District> findById(String id) {
        Optional<District> district = districtRepository.findById(id);

        if (district.isPresent()) {
            return ResponseEntity.ok(district.get());
        } else {
            return ResponseEntity.notFound().build();
            // throw new ResourceNotFoundException("District not found with id : " + id);
        }
    }

    public ResponseEntity<List<District>> getByClusterId(String id){
        Optional<Cluster> cluster = clusterRepository.findById(id);
        if(cluster.isPresent()){
            if(!cluster.get().getDistricts().isEmpty()){
                List<District> districts = districtRepository.findAllById(cluster.get().getDistricts());
                return ResponseEntity.ok(districts);
            }
            else{
                return ResponseEntity.notFound().build();
            }
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }

    public String create(District district, String clusterId) {
        try {
            Optional<Cluster> cluster = clusterRepository.findById(clusterId);
            if (cluster.isPresent()) {
                District newDistrict = new District(district.getPolsbyPopper(), district.getMajMin(),
                        district.getPartisanLean());
                districtRepository.save(newDistrict);

                Cluster clusterUpdate = cluster.get();
                List<String> districts = clusterUpdate.getDistricts();
                districts.add(newDistrict.getId());
                clusterUpdate.setDistricts(districts);
                clusterRepository.save(clusterUpdate);
                return newDistrict.getId();
            } else {
                throw new ResourceNotFoundException(
                        "Failed to find cluster ObjectId(\'" + clusterId + "\') to add district to");
            }
        } catch (Exception e) {
            System.out.println(e);
            return "Failed to add district to cluster with ObjectId : " + clusterId;
        }
    }

    

}
