package com.example.demo.Service;

import com.example.demo.Entity.BusynessBO;
import com.example.demo.Entity.Location;
import com.example.demo.Entity.ModelInput;
import com.example.demo.Repository.LocationRepository;
import com.example.demo.Service.Impl.PredictionServiceImpl;
import com.example.demo.Utils.PredictionUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Mock
    private LocationRepository locationRepository;
    private PredictionServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new PredictionServiceImpl(locationRepository);
    }

    @Test
    void makePrediction() {
        // given
        List<Location> locations = Arrays.asList(
                new Location(4),
                new Location(127),
                new Location(12),
                new Location(13),
                new Location(68)
        );
        ModelInput modelInput1 = new ModelInput(5,11,9,2,2.6,10,0,5);
        ModelInput modelInput2 = new ModelInput(6,6,16,3,1.6,3,3.25,17.2);
        ModelInput modelInput3 = new ModelInput(21,6,30,3,2.4,10,0,24.4);
        ModelInput modelInput4 = new ModelInput(8,10,12,2,1.2,10,0,16.1);
        ModelInput modelInput5 = new ModelInput(5,11,9,2,2.6,10,0,5);

        // mock location repository
        when(locationRepository.findAll()).thenReturn(locations);
        //when
        List<BusynessBO> results1 = underTest.makePrediction(modelInput1);
        List<BusynessBO> results2 = underTest.makePrediction(modelInput2);
        List<BusynessBO> results3 = underTest.makePrediction(modelInput3);
        List<BusynessBO> results4 = underTest.makePrediction(modelInput4);
        List<BusynessBO> results5 = underTest.makePrediction(modelInput5);

        System.out.println(results1);
        System.out.println(results2);
        System.out.println(results3);
        System.out.println(results4);
        System.out.println(results5);

        //then
        assertEquals(5, results1.size());
    }
}
