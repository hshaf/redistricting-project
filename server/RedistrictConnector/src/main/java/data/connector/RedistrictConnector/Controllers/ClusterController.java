package data.connector.RedistrictConnector.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Services.ClusterService;

@RestController
@RequestMapping("/cluster")
public class ClusterController {

    @Autowired
    ClusterService clusterService;

    @GetMapping("/{id}")
    public ResponseEntity<Cluster> getClusterById(@PathVariable String id) {
        return clusterService.findById(id);
    }

    @GetMapping("/ensemble/{id}")
    public ResponseEntity<List<Cluster>> getClustersByEnsemble(@PathVariable String id) {
        return clusterService.getByEnsembleId(id);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from ClusterController";
    }

    @PostMapping("/add/{ensembleId}")
    public String createCluster(@RequestBody Cluster cluster, @PathVariable String ensembleId) {
        return clusterService.create(cluster, ensembleId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Cluster> updateCluster(@RequestBody Cluster cluster, @PathVariable String id) {
        return clusterService.update(cluster, id);
    }

}
