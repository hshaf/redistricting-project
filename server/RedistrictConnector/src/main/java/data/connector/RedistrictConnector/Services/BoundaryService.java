package data.connector.RedistrictConnector.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.Boundary;
import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Repositories.BoundaryRepository;
import data.connector.RedistrictConnector.Repositories.DistrictRepository;

@Service
public class BoundaryService {

  @Autowired
  BoundaryRepository boundaryRepository;

  @Autowired
  DistrictRepository districtRepository;

  public Boundary findById(String id) {
    Optional<Boundary> boundary = boundaryRepository.findById(id);

    if (boundary.isPresent()) {
      return boundary.get();
    } else {
      throw new ResourceNotFoundException("Boundary not found with id : " + id);
    }
  }

  public String create(Object data, String districtId) {
    try {
      Optional<District> district = districtRepository.findById(districtId);
      if (district.isPresent()) {
        Boundary newBoundary = new Boundary(data);
        boundaryRepository.save(newBoundary);

        District districtUpdate = district.get();
        districtUpdate.setBoundary(newBoundary.getId());
        districtRepository.save(districtUpdate);
        return newBoundary.getId();
      } else {
        throw new ResourceNotFoundException("Failed to find district \'" + districtId + "\' to add boundary to");
      }

    } catch (Exception e) {
      System.out.println(e);
      return "Failed to add boundary to district with id : " + districtId;
    }
  }
}
