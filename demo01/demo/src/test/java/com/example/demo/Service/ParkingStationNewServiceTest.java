package com.example.demo.Service;

import com.example.demo.Entity.ParkingStationNew;
import com.example.demo.Entity.VO.ParkingStationNewVO;
import com.example.demo.Repository.ParkingStationNewRepository;
import com.example.demo.Service.Impl.ParkingStationNewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParkingStationNewServiceTest {
    @Mock
    private ParkingStationNewRepository parkingStationNewRepository;
    private ParkingStationNewServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new ParkingStationNewServiceImpl(parkingStationNewRepository);
    }

    @Test
    void getAllParkingStationNew() {
        // given
        ParkingStationNew parkingStationNew
                = new ParkingStationNew(1, "null", "null","null","null", "Point", "null", "[-73.9747158, 40.7605308]", 66,
                "null","null","null","[-73.9747158, 40.7605308]");
        List<ParkingStationNew> parkingStationNews = new ArrayList<>();
        parkingStationNews.add(parkingStationNew);
        when(parkingStationNewRepository.findAll()).thenReturn(parkingStationNews);


        //when
        List<ParkingStationNewVO> allParkingStationNew = underTest.getAllParkingStationNew();
        //then
        Mockito.verify(parkingStationNewRepository).findAll();
        assertEquals(1, allParkingStationNew.size());
    }
}