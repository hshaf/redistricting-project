package data.connector.RedistrictConnector.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

import data.connector.RedistrictConnector.Models.EnsembleSummary;
import data.connector.RedistrictConnector.Models.State;
import data.connector.RedistrictConnector.Services.StateService;

@RestController
@RequestMapping("/state")
public class StateController {
    
    @Autowired
    private StateService stateService;

    @GetMapping("/{name}")
    public ResponseEntity<State> getStateByName(@PathVariable String name) {
        return stateService.getStateByName(name);
    }

    @GetMapping("/getNames") //Give mapping of Initials to statename and maybe also type of district plan?
    public ResponseEntity<HashMap<String,String>> getStateNames(){
        return ResponseEntity.ok(new HashMap<String,String>());
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from StateController";
    }

    @PostMapping("/add")
    public String createState(@RequestBody State state) {
        return stateService.create(state);
    }

}
