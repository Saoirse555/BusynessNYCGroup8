package com.example.demo.Service.Impl;

import com.example.demo.Entity.ParkingStationNew;
import com.example.demo.Entity.Point;
import com.example.demo.Entity.VO.ParkingStationNewVO;
import com.example.demo.Repository.ParkingStationNewRepository;
import com.example.demo.Service.ParkingStationNewService;
import com.example.demo.Utils.CoordinatesUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ParkingStationNewServiceImpl implements ParkingStationNewService {
    private final ParkingStationNewRepository parkingStationNewRepository;

    @Override
    public List<ParkingStationNewVO> getAllParkingStationNew() {
        List<ParkingStationNew> stationNews = parkingStationNewRepository.findAll();
        List<ParkingStationNewVO> stationNewVOS = new ArrayList<>();

        for (ParkingStationNew station:
             stationNews) {
            ParkingStationNewVO parkingStationNewVO = new ParkingStationNewVO();
            parkingStationNewVO.setStationID(station.getStationId());
            parkingStationNewVO.setOperator(station.getOperator());
            parkingStationNewVO.setAmenity(station.getAmenity());
            parkingStationNewVO.setLayer(station.getLayer());
            parkingStationNewVO.setOpeningHours(station.getOpeningHours());
            parkingStationNewVO.setGeometryType(station.getGeometryType());
            parkingStationNewVO.setParkingStationName(station.getParkingStationName());
            parkingStationNewVO.setLocationId(station.getLocationId());
            parkingStationNewVO.setParkingType(station.getParkingType());
            parkingStationNewVO.setRateZone(station.getRateZone());
            parkingStationNewVO.setZoneInfo(station.getZoneInfo());

            Point coordinate = CoordinatesUtils.StringToPoint(station.getCenterpoint());
            parkingStationNewVO.setCoordinate(coordinate);

            stationNewVOS.add(parkingStationNewVO);
        }
        return stationNewVOS;
    }
}
