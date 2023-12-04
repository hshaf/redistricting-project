package data.connector.RedistrictConnector.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.DistrictPlan;
import data.connector.RedistrictConnector.Models.Ensemble;
import data.connector.RedistrictConnector.Repositories.ClusterRepository;
import data.connector.RedistrictConnector.Repositories.EnsembleRepository;

@Service
public class ClusterService {
    
    @Autowired
    ClusterRepository clusterRepository;

    @Autowired
    EnsembleRepository ensembleRepository;

    public ResponseEntity<Cluster> findById(String id) {
        Optional<Cluster> cluster = clusterRepository.findById(id);

        if (cluster.isPresent()) {
            return ResponseEntity.ok(cluster.get());
        }
        else {
            return ResponseEntity.notFound().build();
            //throw new ResourceNotFoundException("Cluster not found with id : " + id);
        }
    }

    public ResponseEntity<List<Cluster>> getByEnsembleId(String ensembleId){
        Optional<Ensemble> ensemble = ensembleRepository.findById(ensembleId);
        if(ensemble.isPresent()){
            if(!ensemble.get().getClusters().isEmpty()){
                List<Cluster> clusters = clusterRepository.findAllById(ensemble.get().getClusters());
                return ResponseEntity.ok(clusters);
            }
            else{
                return ResponseEntity.notFound().build();
            }
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }

    public String create(Cluster cluster, String ensembleId) {
        try {
            Optional<Ensemble> ensemble = ensembleRepository.findById(ensembleId);
            if (ensemble.isPresent()) {
                Cluster newCluster = new Cluster(null, new ArrayList<String>(), cluster.getDistrictCount(), new ArrayList<String>());
                clusterRepository.save(newCluster);

                Ensemble ensembleUpdate = ensemble.get();
                List<String> clusters = ensembleUpdate.getClusters();
                clusters.add(newCluster.getId());
                ensembleUpdate.setClusters(clusters);
                ensembleRepository.save(ensembleUpdate);
                return newCluster.getId();
            }
            else {
                throw new ResourceNotFoundException("Failed to find ensemble ObjectId(\'" + ensembleId + "\') to add cluster to");
            }
        }
        catch (Exception e) {
            System.out.println(e);
            return "Failed to add cluster to ensemble with ObjectId : " + ensembleId;
        }
    }

    public ResponseEntity<Cluster> update(Cluster cluster, String id) {
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

            return ResponseEntity.ok(cluster);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
