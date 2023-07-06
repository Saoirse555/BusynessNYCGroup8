package com.example.demo.Repository;

import com.example.demo.Entity.ParkingStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingStationRepository
        extends JpaRepository<ParkingStation, Integer> {
}
