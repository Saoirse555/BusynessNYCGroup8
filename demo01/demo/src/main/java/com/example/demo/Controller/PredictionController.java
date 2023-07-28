package com.example.demo.Controller;

import com.example.demo.Entity.BusynessBO;
import com.example.demo.Entity.ModelInput;

import java.util.List;

public interface PredictionController {
    List<BusynessBO> makePrediction(ModelInput modelInput);
}
