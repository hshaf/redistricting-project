package data.connector.RedistrictConnector.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Ensemble;
import data.connector.RedistrictConnector.Services.EnsembleService;

@RestController
@RequestMapping("/ensemble")
public class EnsembleController {

    @Autowired
    EnsembleService ensembleService;

    @GetMapping("/{id}")
    public ResponseEntity<Ensemble> getEnsembleById(@PathVariable String id) {
        return ensembleService.findById(id);
    }

    @GetMapping("/state/{initial}")
    public ResponseEntity<List<Ensemble>> getEnsemblesByState(@PathVariable String initial) {
        return ensembleService.getEnsembleList(initial);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Ensemble>> getAllEnsembles() {
        return ensembleService.getEnsembleList();
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from EnsembleController";
    }

    @PostMapping("/add/{state}")
    public String createEnsemble(@RequestBody Ensemble ensemble, @PathVariable String state) {
        return ensembleService.create(ensemble, state);
    }
	
}
