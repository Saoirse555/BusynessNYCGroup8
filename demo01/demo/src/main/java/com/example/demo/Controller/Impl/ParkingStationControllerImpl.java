package com.example.demo.Controller.Impl;

import com.example.demo.Controller.ParkingStationController;
import com.example.demo.Entity.VO.ParkingStationVO;
import com.example.demo.Service.Impl.ParkingStationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "automate_api/v1/parkingstations")
@CrossOrigin(origins = "*")
public class ParkingStationControllerImpl implements ParkingStationController {
    private final ParkingStationServiceImpl parkingStationService;

    @Override
    @GetMapping
    public List<ParkingStationVO> getAllParkingStation() {
        return parkingStationService.getAllParkingStation();
    }
}
