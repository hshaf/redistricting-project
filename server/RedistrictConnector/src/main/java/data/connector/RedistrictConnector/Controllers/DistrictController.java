package data.connector.RedistrictConnector.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Ensemble;

@RestController
@RequestMapping("/district")
public class DistrictController {

  // @GetMapping("/{id}")
  // public District getDistrictById() {
  //   return new District(); // Temporary
  // }
}
