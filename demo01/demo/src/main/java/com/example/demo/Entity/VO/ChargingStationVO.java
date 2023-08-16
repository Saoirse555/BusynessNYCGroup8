package com.example.demo.Entity.VO;

import com.example.demo.Entity.Point;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChargingStationVO {
    private int stationId;
    private String name;
    private int locationId;
    private String operator;
    private String type;
    private Point coordinates;
}
