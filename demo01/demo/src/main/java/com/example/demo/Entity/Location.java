package com.example.demo.Entity;

import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table
public class Location {
    @Id
    @SequenceGenerator(
            name = "location_sequence",
            sequenceName = "location_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            generator = "location_sequence",
            strategy = GenerationType.SEQUENCE)
    private int locationId;
    private String locationName;

    public Location(String locationName) {
        this.locationName = locationName;
    }
}
