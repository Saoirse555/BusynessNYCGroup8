package com.example.demo.Service;

import com.example.demo.Entity.BusynessBO;
import com.example.demo.Entity.ModelInput;

import java.util.List;

public interface PredictionService {
    List<BusynessBO> makePrediction(ModelInput modelInput);
}
