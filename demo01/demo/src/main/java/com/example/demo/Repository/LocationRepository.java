package com.example.demo.Repository;

import com.example.demo.Entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository
        extends JpaRepository<Location, Integer> {
}
