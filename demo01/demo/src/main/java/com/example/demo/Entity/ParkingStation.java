package com.example.demo.Entity;


import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "parking_station")
public class ParkingStation {
    @Id
    @SequenceGenerator(
            name = "parking_station_sequence",
            sequenceName = "parking_station_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "parking_station_sequence",
            strategy = GenerationType.SEQUENCE)
    private int stationId;

    private String parkingStationName;
    private String coordinates;
    private String rateZone;
    private String zoneInfo;
    private int locationId;
    private String geometryType;


}
