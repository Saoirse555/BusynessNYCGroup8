package com.example.demo.Controller.Impl;

import com.alibaba.fastjson2.JSONObject;
import com.example.demo.Controller.PredictionController;
import com.example.demo.Entity.BusynessBO;
import com.example.demo.Entity.ModelInput;
import com.example.demo.Service.Impl.PredictionServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("automate_api/v1/prediction")
@CrossOrigin(origins = "*")
public class PredictionControllerImpl implements PredictionController {
    private final PredictionServiceImpl predictionService;

    @Override
    @PostMapping
    public List<BusynessBO> makePrediction(@RequestBody ModelInput modelInput) {
        List<BusynessBO> prediction = predictionService.makePrediction(modelInput);
        return prediction;
    }
}
