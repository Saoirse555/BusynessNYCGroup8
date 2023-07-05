package com.example.demo.Entity.VO;

import com.example.demo.Entity.Point;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ParkingStationVO {
    private int stationId;
    private String parkingStationName;
    private Point coordinates;
    private String rateZone;
    private String zoneInfo;
    private int locationId;
    private String geometryType;
}
