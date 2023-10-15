package data.connector.RedistrictConnector.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

    public District findById(String id) {
        Optional<District> district = districtRepository.findById(id);

        if (district.isPresent()) {
            return district.get();
        }
        else {
            throw new ResourceNotFoundException("District not found with id : " + id);
        }
    }

    public String create(District district, String clusterId) {
        try {            
            Optional<Cluster> cluster = clusterRepository.findById(clusterId);
            if (cluster.isPresent()) {
                District newDistrict = new District(district.getPolsbyPopper(), district.getMajMin(), district.getPartisanLean());
                districtRepository.save(newDistrict);

                Cluster clusterUpdate = cluster.get();
                List<District> districts = clusterUpdate.getDistricts();
                districts.add(newDistrict);
                clusterUpdate.setDistricts(districts);
                clusterRepository.save(clusterUpdate);
            }
            else {
                throw new ResourceNotFoundException("Failed to add district to cluster with id : " + clusterId);
            }

            return "Added district successfully";
        }
        catch (Exception e) {
            System.out.println(e);
            return "Adding district failed";
        }
    }

}
