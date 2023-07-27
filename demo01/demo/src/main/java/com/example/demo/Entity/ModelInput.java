package com.example.demo.Entity;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ModelInput {
    //{"hour":15,"month":7,"day":22,"day_of_week":6,"wind_spd":3.76,"vis":10,"precip":0.0,"temp":26.1}
    private int hour;
    private int month;
    private int day;
    private int dayOfWeek;
    private double windSpd;
    private int vis;
    private double precip;
    private double temp;
}
