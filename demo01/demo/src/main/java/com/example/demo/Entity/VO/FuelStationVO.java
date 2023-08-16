package com.example.demo.Entity.VO;

import com.example.demo.Entity.Point;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FuelStationVO {
    private int stationId;
    private String name;
    private int locationId;
    private String operator;
    private String type;
    private Point coordinates;
}
