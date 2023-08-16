package com.example.demo.Utils;

import com.example.demo.Entity.LineString;
import com.example.demo.Entity.Point;
import com.example.demo.Entity.Polygon;
import com.example.demo.Utils.CoordinatesUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

//@SpringBootTest
public class CoordinatesUtilsTests {
    @Test
    void toPoints() {
        String pointString = "[-73.9907287, 40.757784]";
        Point point = CoordinatesUtils.StringToPoint(pointString);
        System.out.println(point);
    }

    @Test
    void toLineString(){
        String lineStringString = "[[-73.9907287, 40.757784], [-73.9901775, 40.7575493], [-73.990002, 40.7577923], [-73.9900795, 40.7578275]]";
        LineString lineString = CoordinatesUtils.StringToLineString(lineStringString);
        System.out.println(lineString);
    }

    @Test
    void toPolygon(){
        String coordinatesString = "[[[[-73.9907287, 40.757784], [-73.9901775, 40.7575493], " +
                "[-73.990002, 40.7577923], [-73.9900795, 40.7578275], [-73.9902891, 40.757915], " +
                "[-73.9901152, 40.7581557], [-73.9904549, 40.7583004], [-73.9904874, 40.7582554], " +
                "[-73.9905777, 40.7581304], [-73.9906088, 40.7580872], [-73.9906565, 40.7580223], " +
                "[-73.9906488, 40.7580192], [-73.9905901, 40.7579947], [-73.9905702, 40.7579864], " +
                "[-73.9905114, 40.7579618], [-73.9905789, 40.7578684], [-73.9905737, 40.7578568], " +
                "[-73.9905809, 40.7578468], [-73.9905975, 40.7578432], [-73.9906222, 40.7578091], " +
                "[-73.9906167, 40.7577972], [-73.99065, 40.7577511], [-73.9907287, 40.757784]]]]";
        Polygon polygon = CoordinatesUtils.StringToPolygon(coordinatesString);
        System.out.println(polygon);
    }
}
