package com.example.demo.Entity;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Polygon {
    private List<Point> coordinates;
}
