package com.example.demo.Service.Impl;

import com.example.demo.Entity.LineString;
import com.example.demo.Entity.ParkingStation;
import com.example.demo.Entity.Point;
import com.example.demo.Entity.Polygon;
import com.example.demo.Entity.VO.ParkingStationVO;
import com.example.demo.Repository.ParkingStationRepository;
import com.example.demo.Service.ParkingStationService;
import com.example.demo.Utils.CoordinatesUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ParkingStationServiceImpl implements ParkingStationService {
    private final ParkingStationRepository parkingStationRepository;

    @Override
    public List<ParkingStationVO> getAllParkingStation() {
        List<ParkingStation> parkingStations = parkingStationRepository.findAll();
        List<ParkingStationVO> parkingStationVOList = new ArrayList<>();
        for (ParkingStation station:parkingStations) {
            ParkingStationVO parkingStationVO = new ParkingStationVO();
            parkingStationVO.setStationId(station.getStationId());
            parkingStationVO.setParkingStationName(station.getParkingStationName());
            //calculate the centre of coordinate
            switch (station.getGeometryType()) {
                case "Point": {
                    Point center = CoordinatesUtils.StringToPoint(station.getCoordinates());
                    parkingStationVO.setCoordinates(center);
                    break;
                }
                case "LineString": {
                    LineString lineString = CoordinatesUtils.StringToLineString(station.getCoordinates());
                    List<Point> coordinates = lineString.getCoordinates();
                    Point center = CoordinatesUtils.calculateCenter(coordinates);
                    parkingStationVO.setCoordinates(center);
                    break;
                }
                case "MultiPolygon": {
                    Polygon polygon = CoordinatesUtils.StringToPolygon(station.getCoordinates());
                    List<Point> coordinates = polygon.getCoordinates();
                    Point center = CoordinatesUtils.calculateCenter(coordinates);
                    parkingStationVO.setCoordinates(center);
                    break;
                }
            }
            parkingStationVO.setRateZone(station.getRateZone());
            parkingStationVO.setZoneInfo(station.getZoneInfo());
            parkingStationVO.setLocationId(station.getLocationId());
            parkingStationVO.setGeometryType(station.getGeometryType());

            parkingStationVOList.add(parkingStationVO);
        }
        return parkingStationVOList;
    }


}
