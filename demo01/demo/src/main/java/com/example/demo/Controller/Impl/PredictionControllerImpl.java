package com.example.demo.Controller.Impl;

import com.example.demo.Controller.PredictionController;
import com.example.demo.Entity.ModelInput;
import com.example.demo.Service.Impl.PredictionServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/prediction")
public class PredictionControllerImpl implements PredictionController {
    private final PredictionServiceImpl predictionService;

    @Override
    @PostMapping
    public double makePrediction(@RequestBody ModelInput modelInput) {
        return predictionService.makePrediction(modelInput);
    }
}
