package data.connector.RedistrictConnector.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import data.connector.RedistrictConnector.Models.Ensemble;

@RestController
@RequestMapping("/district")
public class DistrictController {//Each method will use a soon to be made District service

  // @GetMapping("/{id}")
  // public District getDistrictById() {
  //   return new District(); // Temporary
  // }
}
