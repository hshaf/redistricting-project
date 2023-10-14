package data.connector.RedistrictConnector.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import data.connector.RedistrictConnector.Models.Ensemble;
import data.connector.RedistrictConnector.Services.StateService;

@RestController
@RequestMapping("/state")
public class StateController {
    
    private StateService stateService;

    public StateController (StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping("/{name}")
    public List<String> getEnsemblesByState(@PathVariable String name) {
        return stateService.findByName(name);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "hi :)";
    }
}
