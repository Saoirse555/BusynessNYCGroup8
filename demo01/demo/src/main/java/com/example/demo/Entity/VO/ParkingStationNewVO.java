package com.example.demo.Entity.VO;

import com.example.demo.Entity.Point;
import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ParkingStationNewVO {
    private int stationID;
    private String operator;
    private String amenity;
    private String layer;
    private String openingHours;
    private String geometryType;
    private String parkingStationName;
    private int locationId;
    private String parkingType;
    private String rateZone;
    private String zoneInfo;
    private Point coordinate;
}
