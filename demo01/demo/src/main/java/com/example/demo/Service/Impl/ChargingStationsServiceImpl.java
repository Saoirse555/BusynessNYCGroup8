package com.example.demo.Service.Impl;

import com.example.demo.Entity.ChargingStation;
import com.example.demo.Entity.LineString;
import com.example.demo.Entity.Point;
import com.example.demo.Entity.Polygon;
import com.example.demo.Entity.VO.ChargingStationVO;
import com.example.demo.Repository.ChargingStationRepository;
import com.example.demo.Service.ChargingStationService;
import com.example.demo.Utils.CoordinatesUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class ChargingStationsServiceImpl implements ChargingStationService {
    private final ChargingStationRepository chargingStationRepository;

    @Override
    public List<ChargingStationVO> getAllChargingStations() {
        List<ChargingStation> chargingStations = chargingStationRepository.findAll();
        List<ChargingStationVO> chargingStationVOList = new ArrayList<>();
        for (ChargingStation chargingStation : chargingStations){
            ChargingStationVO chargingStationVO = new ChargingStationVO();
            chargingStationVO.setStationId(chargingStation.getStationId());
            chargingStationVO.setLocationId(chargingStation.getLocationId());
            chargingStationVO.setName(chargingStation.getName());
            chargingStationVO.setOperator(chargingStation.getOperator());
            chargingStationVO.setType(chargingStation.getType());
            //coordinate
            switch (chargingStation.getType()) {
                case "Point": {
                    Point center = CoordinatesUtils.StringToPoint(chargingStation.getCoordinates());
                    chargingStationVO.setCoordinates(center);
                    break;
                }
                case "LineString": {
                    LineString lineString = CoordinatesUtils.StringToLineString(chargingStation.getCoordinates());
                    List<Point> coordinates = lineString.getCoordinates();
                    Point center = CoordinatesUtils.calculateCenter(coordinates);
                    chargingStationVO.setCoordinates(center);
                    break;
                }
                case "MultiPolygon": {
                    Polygon polygon = CoordinatesUtils.StringToPolygon(chargingStation.getCoordinates());
                    List<Point> coordinates = polygon.getCoordinates();
                    Point center = CoordinatesUtils.calculateCenter(coordinates);
                    chargingStationVO.setCoordinates(center);
                    break;
                }
            }


            chargingStationVOList.add(chargingStationVO);
        }
        return chargingStationVOList;
    }
}
