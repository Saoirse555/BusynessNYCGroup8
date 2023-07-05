package com.example.demo.Entity;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LineString {
    private List<Point> coordinates;
}
