package com.example.demo.Service.Impl;

import com.example.demo.Entity.ModelInput;
import com.example.demo.Service.PredictionService;
import com.example.demo.Utils.PredictionUtils;
import org.springframework.stereotype.Service;

@Service
public class PredictionServiceImpl implements PredictionService {
    @Override
    public double makePrediction(ModelInput modelInput) {
        return PredictionUtils.makePrediction(modelInput);
    }
}
