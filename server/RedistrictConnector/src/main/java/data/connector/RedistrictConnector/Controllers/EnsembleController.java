package data.connector.RedistrictConnector.Controllers;


import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Cluster;
import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Models.Ensemble;
import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/ensemble")
public class EnsembleController {//Each method will use a soon to be made Ensemble service

    @GetMapping("/{id}")
    public Ensemble getEnsembleById(@PathVariable Integer id){ //The whole ensemble, districts and clusters too
      return new Ensemble("New York"); //Temporary
    }

    @GetMapping("/state")
    public List<Ensemble> getStateEnsembles(@RequestParam String state){ //Ensembles belonging to state. Maybe limit to name and ID t be returned
      List<Ensemble> ensembles = new ArrayList<Ensemble>();
      ensembles.add(new Ensemble("New York"));
      return ensembles; //Temporary
    }

    @GetMapping("/summary/{id}")
    public Ensemble getEnsembleSummary(@PathVariable Integer id){ //Just general info about the ensemble. Likely become a hashmap?
      
      return new Ensemble("New York"); //Temporary
    }

    @GetMapping("/clusters/{id}")
    public List<Cluster> getEnsembleClusters(@PathVariable Integer id){
      List<Cluster> clusters = new ArrayList<Cluster>();
      return clusters;
    }

    @GetMapping("/districts/{id}")
    public List<District> getEnsembleDistricts(@PathVariable Integer id){
      List<District> districts = new ArrayList<District>();
      return districts;
    }


	
}
