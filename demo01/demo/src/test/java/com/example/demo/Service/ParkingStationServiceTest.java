package com.example.demo.Service;

import com.example.demo.Entity.FuelStation;
import com.example.demo.Entity.ParkingStation;
import com.example.demo.Entity.VO.FuelStationVO;
import com.example.demo.Entity.VO.ParkingStationVO;
import com.example.demo.Repository.ParkingStationRepository;
import com.example.demo.Service.Impl.ParkingStationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParkingStationServiceTest {
    @Mock
    private ParkingStationRepository parkingStationRepository;
    private ParkingStationServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new ParkingStationServiceImpl(parkingStationRepository);
    }

    @Test
    void getAllParkingStation() {
        //given
        ParkingStation parkingStation1 = new ParkingStation(1, "uname", "[-73.9747158, 40.7605308]", "unknown", "unknown",2, "Point");
        ParkingStation parkingStation2 = new ParkingStation(1, "uname", "[[-73.9805486, 40.7472197], [-73.9805656, 40.7471966], [-73.980558, 40.7471934], [-73.9806333, 40.7470915], [-73.9806962, 40.7471184], [-73.9809449, 40.7472247], [-73.9808734, 40.7473214], [-73.9807854, 40.7472838], [-73.9807646, 40.747312], [-73.9806062, 40.7472443], [-73.9805486, 40.7472197]]", "unknown", "unknown",3,"LineString");
        ParkingStation parkingStation3 = new ParkingStation(1, "uname", "[[[[-73.9868793, 40.7516559], [-73.9866935, 40.7515791], [-73.9866096, 40.7516966], [-73.9867954, 40.7517734], [-73.9868793, 40.7516559]]]]", "unknown", "unknown",4,"MultiPolygon");
        List<ParkingStation> parkingStations = Arrays.asList(parkingStation1,parkingStation2,parkingStation3);

        when(parkingStationRepository.findAll()).thenReturn(parkingStations);


        //when
        List<ParkingStationVO> allParkingStation = underTest.getAllParkingStation();
        //then
        Mockito.verify(parkingStationRepository).findAll();
        assertEquals(3, allParkingStation.size());
    }
}