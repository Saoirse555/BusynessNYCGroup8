package com.example.demo.Controller.Impl;

import com.example.demo.Controller.FuelStationController;
import com.example.demo.Entity.VO.FuelStationVO;
import com.example.demo.Service.Impl.FuelStationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "automate_api/v1/fuel-stations")
@CrossOrigin(origins = "*")
public class FuelStationControllerImpl implements FuelStationController {
    private final FuelStationServiceImpl fuelStationService;

    @Override
    @GetMapping
    public List<FuelStationVO> getAllFuelStations() {
        return fuelStationService.getAllFuelStations();
    }
}
