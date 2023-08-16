package com.example.demo.Service;

import com.example.demo.Repository.LocationRepository;
import com.example.demo.Service.Impl.LocationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;
    private LocationServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new LocationServiceImpl(locationRepository);
    }


    @Test
    void getAllLocations() {
        //when
        underTest.getAllLocations();
        //then
        Mockito.verify(locationRepository).findAll();
    }
}