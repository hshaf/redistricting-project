package data.connector.RedistrictConnector.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.DistrictPlan;
import data.connector.RedistrictConnector.Services.DistrictPlanService;

@RestController
@RequestMapping("/districtplan")
public class DistrictPlanController {

    @Autowired
    DistrictPlanService districtService;

    @GetMapping("/{id}")
    public ResponseEntity<DistrictPlan> getDistrictById(@PathVariable String id) {
        return districtService.findById(id);
    }

    @GetMapping("/cluster/{id}")
    public ResponseEntity<List<DistrictPlan>> getDistrictsByClusterId(@PathVariable String id) {
        return districtService.getByClusterId(id);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from DistrictController";
    }

    @PostMapping("/add/{clusterId}")
    public String createDistrict(@RequestBody DistrictPlan district, @PathVariable String clusterId) {
        return districtService.create(district, clusterId);
    }
}
