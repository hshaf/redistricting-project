package data.connector.RedistrictConnector.Services;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Repositories.ClusterRepository;

@Service
public class ClusterService {
    
    @Autowired
    ClusterRepository clusterRepository;

    public Cluster findById(String id) {
        Optional<Cluster> cluster = clusterRepository.findById(id);

        if (cluster.isPresent()) {
            return cluster.get();
        }
        else {
            throw new ResourceNotFoundException("Cluster not found with id : " + id);
        }
    }

    public String create(Cluster cluster) {
        try {
            clusterRepository.save(new Cluster(null, new ArrayList<String>(), cluster.getDistrictCount(), new ArrayList<District>(), cluster.getPolsbyPopper(), cluster.getMajMin(), cluster.getPartisanLean(), cluster.getDistances()));
            return "Added cluster successfully";
        }
        catch (Exception e) {
            return "Adding cluster failed";
        }
    }

    public String update(Cluster cluster, String id) {
        try {           
            Optional<Cluster> oldCluster = clusterRepository.findById(id);
            if (oldCluster.isPresent()) {
                Cluster clusterUpdate = oldCluster.get();
                clusterUpdate.setName(cluster.getName());
                clusterUpdate.setTags(cluster.getTags());
                clusterRepository.save(clusterUpdate);
            }
            else {
                throw new ResourceNotFoundException("Failed update cluster with id : " + cluster);
            }

            return "Updated district successfully";
        }
        catch (Exception e) {
            return "Updating district failed";
        }
    }

}
