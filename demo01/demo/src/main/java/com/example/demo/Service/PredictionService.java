package com.example.demo.Service;

import com.example.demo.Entity.ModelInput;

import java.util.Map;

public interface PredictionService {
    Map<String, String> makePrediction(ModelInput modelInput);
}
