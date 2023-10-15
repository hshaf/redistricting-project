package data.connector.RedistrictConnector.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    public Cluster getClusterById(@PathVariable String id) {
        return clusterService.findById(id);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from ClusterController";
    }

    @PostMapping("/add")
    public String createCluster(@RequestBody Cluster cluster) {
        return clusterService.create(cluster);
    }

    @PostMapping("/update/{id}")
    public String updateCluster(@RequestBody Cluster cluster, @PathVariable String id) {
        return clusterService.update(cluster, id);
    }

}
