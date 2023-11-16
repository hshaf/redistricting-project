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

    @GetMapping("/{initials}")
    public ResponseEntity<State> getStateByInitials(@PathVariable String initials) {
        return stateService.getStateByInitials(initials);
    }

    @GetMapping("/getNames") //Give mapping of Initials to statename and maybe also type of district plan?
    public ResponseEntity<HashMap<String,String>> getAllStateInfo(){
        return stateService.getStateInfo();
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
