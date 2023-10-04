package data.connector.RedistrictConnector.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.District;


@RestController
@RequestMapping("/cluster")
public class ClusterController {//Each method will use a soon to be made Cluster service

	@GetMapping("/{id}")
  public Cluster getClusterById() {
    return new Cluster("temp"); // Temporary
  }

  @GetMapping("/summary/{id}")
  public Cluster getClusterSummary() { //Likely to become hashmap
    return new Cluster("temp"); // Temporary
  }

  @GetMapping("/districts/{id}")
  public List<District> getClusterDistricts(@PathVariable Integer id ){
    return new ArrayList<District>();
  }

  @PutMapping("/addTag/{id}")
  public ResponseEntity<Cluster> putClusterTag(@RequestBody Cluster cluster, @PathVariable Integer id){

    return ResponseEntity.ok(new Cluster("null"));
  }
}
