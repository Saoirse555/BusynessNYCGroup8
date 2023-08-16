package com.example.demo.Entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "parking_station_new")
public class ParkingStationNew {
    @Id
    @SequenceGenerator(
            name = "parking_station_new_sequence",
            sequenceName = "parking_station_new_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "parking_station_new_sequence",
            strategy = GenerationType.SEQUENCE)
    private int stationId;

    private String operator;
    private String amenity;
    private String layer;
    private String openingHours;
    private String geometryType;
    private String parkingStationName;
    private String coordinates;
    private int locationId;
    private String parkingType;
    private String rateZone;
    private String zoneInfo;
    private String centerpoint;
}
