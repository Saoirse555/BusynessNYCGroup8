package com.example.demo.Repository;

import com.example.demo.Entity.Location;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class LocationRepositoryTest {
    @Autowired
    private LocationRepository undertest;

    @AfterEach
    void tearDown(){
        undertest.deleteAll();
    }

    @Test
    void selectLocationTest(){
        //given
        Location location = new Location(7);
        undertest.save(location);

        //when
        List<Location> locations = undertest.findAll();
        Location expected = locations.get(0);

        //then
        assertEquals(expected.getLocationId(),location.getLocationId());
    }

}