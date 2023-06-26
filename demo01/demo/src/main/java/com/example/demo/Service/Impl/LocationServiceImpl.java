package com.example.demo.Service.Impl;

import com.example.demo.Entity.Location;
import com.example.demo.Repository.LocationRepository;
import com.example.demo.Service.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;

    @Override
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
}
