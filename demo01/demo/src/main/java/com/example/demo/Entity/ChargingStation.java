package com.example.demo.Entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "charging_station")
public class ChargingStation {
    @Id
    @SequenceGenerator(
            name = "charging_station_sequence",
            sequenceName = "charging_station_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "charging_station_sequence",
            strategy = GenerationType.SEQUENCE)
    private int stationId;

    private String name;
    private int locationId;
    private String amenity;
    private String operator;
    private String type;
    private String coordinates;


}
