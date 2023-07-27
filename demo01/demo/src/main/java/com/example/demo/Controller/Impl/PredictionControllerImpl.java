package com.example.demo.Controller.Impl;

import com.alibaba.fastjson2.JSONObject;
import com.example.demo.Controller.PredictionController;
import com.example.demo.Entity.ModelInput;
import com.example.demo.Service.Impl.PredictionServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/prediction")
@CrossOrigin(origins = "*")
public class PredictionControllerImpl implements PredictionController {
    private final PredictionServiceImpl predictionService;

    @Override
    @PostMapping
    public JSONObject makePrediction(@RequestBody ModelInput modelInput) {
        Map<String,String> prediction = predictionService.makePrediction(modelInput);
        return new JSONObject(prediction);
    }
}
