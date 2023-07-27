package com.example.demo.Service.Impl;

import com.example.demo.Entity.Location;
import com.example.demo.Entity.ModelInput;
import com.example.demo.Repository.LocationRepository;
import com.example.demo.Service.PredictionService;
import com.example.demo.Utils.PredictionUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class PredictionServiceImpl implements PredictionService {
    private final LocationRepository locationRepository;

    @Override
    public Map<String, String> makePrediction(ModelInput modelInput) {
        //get location IDs
        List<Location> locations = locationRepository.findAll();
        List<Integer> locationIDs = new ArrayList<>();
        for (Location location : locations
        ) {
            locationIDs.add(location.getLocationId());
        }

        //make prediction for each location
        Map<String, String> predictionResults = new LinkedHashMap<>();
        for (int locationID : locationIDs
        ) {
            double result = PredictionUtils.makePrediction(locationID, modelInput);
            predictionResults.put(locationID + "", result + "");
        }


        return predictionResults;
    }
}
