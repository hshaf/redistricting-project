package data.connector.RedistrictConnector.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data.connector.RedistrictConnector.ResourceNotFoundException;
import data.connector.RedistrictConnector.Models.District;
import data.connector.RedistrictConnector.Repositories.DistrictRepository;

@Service
public class DistrictService {
    
    @Autowired
    private DistrictRepository districtRepository;

    public District findById(String id) {
        Optional<District> district = districtRepository.findById(id);

        if (district.isPresent()) {
            return district.get();
        }
        else {
            throw new ResourceNotFoundException("Record not found with id : " + id);
        }
    }

}
