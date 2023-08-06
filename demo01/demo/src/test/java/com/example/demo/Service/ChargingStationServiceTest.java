package com.example.demo.Service;

import com.example.demo.Entity.ChargingStation;
import com.example.demo.Entity.VO.ChargingStationVO;
import com.example.demo.Repository.ChargingStationRepository;
import com.example.demo.Service.Impl.ChargingStationsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChargingStationServiceTest {
    @Mock
    private ChargingStationRepository chargingStationRepository;
    private ChargingStationsServiceImpl underTest;

    @BeforeEach
    void setUp(){
        underTest = new ChargingStationsServiceImpl(chargingStationRepository);
    }

    @Test
    void getAllChargingStations() {
        //given
        ChargingStation chargingStation1 = new ChargingStation(1, "uname", 2, "charging", "unknown","Point","[-73.9747158, 40.7605308]");
        ChargingStation chargingStation2 = new ChargingStation(1, "uname", 2, "charging", "unknown","LineString","[[-73.9805486, 40.7472197], [-73.9805656, 40.7471966], [-73.980558, 40.7471934], [-73.9806333, 40.7470915], [-73.9806962, 40.7471184], [-73.9809449, 40.7472247], [-73.9808734, 40.7473214], [-73.9807854, 40.7472838], [-73.9807646, 40.747312], [-73.9806062, 40.7472443], [-73.9805486, 40.7472197]]");
        ChargingStation chargingStation3 = new ChargingStation(1, "uname", 2, "charging", "unknown","MultiPolygon","[[[[-73.9868793, 40.7516559], [-73.9866935, 40.7515791], [-73.9866096, 40.7516966], [-73.9867954, 40.7517734], [-73.9868793, 40.7516559]]]]");
        List<ChargingStation> chargingStations = Arrays.asList(chargingStation1,chargingStation2,chargingStation3);

        when(chargingStationRepository.findAll()).thenReturn(chargingStations);


        //when
        List<ChargingStationVO> allChargingStationsVOs = underTest.getAllChargingStations();
        //then
        Mockito.verify(chargingStationRepository).findAll();
        assertEquals(3, allChargingStationsVOs.size());
    }
}