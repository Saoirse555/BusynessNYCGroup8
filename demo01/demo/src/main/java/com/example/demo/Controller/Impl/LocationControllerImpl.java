package com.example.demo.Controller.Impl;

import com.example.demo.Controller.LocationController;
import com.example.demo.Entity.Location;
import com.example.demo.Service.Impl.LocationServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "automate_api/v1/locations")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class LocationControllerImpl implements LocationController {
    private final LocationServiceImpl locationServiceImpl;

    @Override
    @GetMapping
    public List<Location> getAllLocation() {
        return locationServiceImpl.getAllLocations();
    }
}
