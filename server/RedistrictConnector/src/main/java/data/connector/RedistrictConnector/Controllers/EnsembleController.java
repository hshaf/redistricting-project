package data.connector.RedistrictConnector.Controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Ensemble;

@RestController
@RequestMapping("/ensemble")
public class EnsembleController {

    @GetMapping("/{state}/{id}")
    public Ensemble getEnsembleById(){
      return new Ensemble("New York"); //Temporary
    }
	
}
