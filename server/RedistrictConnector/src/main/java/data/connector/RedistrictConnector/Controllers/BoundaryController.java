package data.connector.RedistrictConnector.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Boundary;
import data.connector.RedistrictConnector.Services.BoundaryService;

@RestController
@RequestMapping("/boundary")
public class BoundaryController {

    @Autowired
    BoundaryService boundaryService;

    @GetMapping("/{id}")
    public ResponseEntity<Boundary> getBoundaryById(@PathVariable String id) {
        return boundaryService.findById(id);
    }

    @GetMapping("/district/{id}")
    public ResponseEntity<Boundary> getBoundaryByDistrictId(@PathVariable String id) {
        return boundaryService.findByDistrictId(id);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from BoundaryController";
    }

    @PostMapping("/add/{id}")
    public String createBoundary(@RequestBody Object data, @PathVariable String id) {
        return boundaryService.create(data, id);
    }

}
