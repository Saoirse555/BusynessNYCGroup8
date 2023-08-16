package com.example.demo.Controller.Impl;

import com.example.demo.Controller.ChargingStationController;
import com.example.demo.Entity.VO.ChargingStationVO;
import com.example.demo.Service.Impl.ChargingStationsServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "automate_api/v1/charging-stations")
@CrossOrigin(origins = "*")
public class ChargingStationControllerImpl implements ChargingStationController {
    private final ChargingStationsServiceImpl chargingStationsService;

    @Override
    @GetMapping
    public List<ChargingStationVO> getAllChargingStation() {
        return chargingStationsService.getAllChargingStations();
    }
}
