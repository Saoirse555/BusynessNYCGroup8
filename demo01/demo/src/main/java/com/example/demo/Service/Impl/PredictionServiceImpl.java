package com.example.demo.Service.Impl;

import com.example.demo.Entity.BusynessBO;
import com.example.demo.Entity.Location;
import com.example.demo.Entity.ModelInput;
import com.example.demo.Repository.LocationRepository;
import com.example.demo.Service.PredictionService;
import com.example.demo.Utils.PredictionUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class PredictionServiceImpl implements PredictionService {
    private final LocationRepository locationRepository;

    //0-9.0: low; 9-93.0: medium; 93.0+: high
    @Override
    public List<BusynessBO> makePrediction(ModelInput modelInput) {
        //get location IDs
        List<Location> locations = locationRepository.findAll();
        List<Integer> locationIDs = new ArrayList<>();
        for (Location location : locations
        ) {
            locationIDs.add(location.getLocationId());
        }
        List<BusynessBO> predictionResults = new ArrayList<>();

        //make prediction for each location
        for (int locationID : locationIDs
        ) {
            double result = PredictionUtils.makePrediction(locationID, modelInput);
            //classify busyness level
            String level;
            if (result<6.5){
                level = "VERY LOW";
            }else if (result<20) {
                level = "LOW";
            }else if(result<52.5) {
                level = "MEDIUM";
            }else if (result<112){
                level = "HIGH";
            }else {
                level = "VERY HIGH";
            }

            //create BO entity
            BusynessBO busynessBO = new BusynessBO(locationID,result,level);
            predictionResults.add(busynessBO);
        }


        return predictionResults;
    }
}
