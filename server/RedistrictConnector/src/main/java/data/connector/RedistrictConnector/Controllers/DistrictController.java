package data.connector.RedistrictConnector.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Services.DistrictService;

@RestController
@RequestMapping("/district")
public class DistrictController {

    @Autowired
    DistrictService districtService;

    @GetMapping("/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable String id) {
        return districtService.findById(id);
    }

    @GetMapping("/")
    public String testEndpoint() {
        return "Hello from DistrictController";
    }

    @PostMapping("/add/{clusterId}")
    public String createDistrict(@RequestBody District district, @PathVariable String clusterId) {
        return districtService.create(district, clusterId);
    }
}
