package com.example.demo.Service.Impl;

import com.example.demo.Entity.*;
import com.example.demo.Entity.VO.FuelStationVO;
import com.example.demo.Repository.FuelStationRepository;
import com.example.demo.Service.FuelStationService;
import com.example.demo.Utils.CoordinatesUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class FuelStationServiceImpl implements FuelStationService {
    private final FuelStationRepository fuelStationRepository;

    @Override
    public List<FuelStationVO> getAllFuelStations() {
        List<FuelStation> fuelStations = fuelStationRepository.findAll();
        List<FuelStationVO> fuelStationVOList = new ArrayList<>();

        for (FuelStation fuelStation : fuelStations){
            FuelStationVO fuelStationVO = new FuelStationVO();
            fuelStationVO.setStationId(fuelStation.getStationId());
            fuelStationVO.setLocationId(fuelStation.getLocationId());
            fuelStationVO.setName(fuelStation.getName());
            fuelStationVO.setOperator(fuelStation.getOperator());
            fuelStationVO.setType(fuelStation.getType());
            //coordinate
            switch (fuelStation.getType()) {
                case "Point": {
                    Point center = CoordinatesUtils.StringToPoint(fuelStation.getCoordinates());
                    fuelStationVO.setCoordinates(center);
                    break;
                }
                case "LineString": {
                    LineString lineString = CoordinatesUtils.StringToLineString(fuelStation.getCoordinates());
                    List<Point> coordinates = lineString.getCoordinates();
                    Point center = CoordinatesUtils.calculateCenter(coordinates);
                    fuelStationVO.setCoordinates(center);
                    break;
                }
                case "MultiPolygon": {
                    Polygon polygon = CoordinatesUtils.StringToPolygon(fuelStation.getCoordinates());
                    List<Point> coordinates = polygon.getCoordinates();
                    Point center = CoordinatesUtils.calculateCenter(coordinates);
                    fuelStationVO.setCoordinates(center);
                    break;
                }
            }


            fuelStationVOList.add(fuelStationVO);
        }
        return fuelStationVOList;
    }
}
