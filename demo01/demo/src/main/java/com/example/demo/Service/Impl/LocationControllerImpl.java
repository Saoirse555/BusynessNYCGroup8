package com.example.demo.Service.Impl;

import com.example.demo.Controller.LocationController;
import com.example.demo.Entity.Location;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/locations")
@AllArgsConstructor
public class LocationControllerImpl implements LocationController {
    private final LocationServiceImpl locationServiceImpl;

    @Override
    @GetMapping
    public List<Location> getAllLocation() {
        return locationServiceImpl.getAllLocations();
    }
}
