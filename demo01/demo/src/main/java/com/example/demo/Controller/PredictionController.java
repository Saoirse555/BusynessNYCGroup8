package com.example.demo.Controller;

import com.alibaba.fastjson2.JSONObject;
import com.example.demo.Entity.ModelInput;

public interface PredictionController {
    JSONObject makePrediction(ModelInput modelInput);
}
