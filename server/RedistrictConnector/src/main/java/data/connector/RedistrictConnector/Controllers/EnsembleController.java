package data.connector.RedistrictConnector.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Ensemble getEnsembleById(@PathVariable String id) {
        return ensembleService.findById(id);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from EnsembleController";
    }

    @PostMapping("/add")
    public String createEnsemble(@RequestBody Ensemble ensemble) {
        return ensembleService.create(ensemble);
    }
	
}
