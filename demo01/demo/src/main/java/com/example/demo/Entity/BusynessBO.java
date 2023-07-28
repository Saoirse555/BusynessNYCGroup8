package com.example.demo.Entity;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BusynessBO {
    private int location;
    private double busyness;
    private String level;
}
