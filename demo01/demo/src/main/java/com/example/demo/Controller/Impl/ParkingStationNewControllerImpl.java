package com.example.demo.Controller.Impl;

import com.example.demo.Controller.ParkingStationNewController;
import com.example.demo.Entity.VO.ParkingStationNewVO;
import com.example.demo.Service.Impl.ParkingStationNewServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "automate_api/v1/parking_stations_new")
public class ParkingStationNewControllerImpl implements ParkingStationNewController {
    private final ParkingStationNewServiceImpl parkingStationNewService;

    @Override
    @GetMapping
    public List<ParkingStationNewVO> getAllParkingStationNew() {
        return parkingStationNewService.getAllParkingStationNew();
    }
}
