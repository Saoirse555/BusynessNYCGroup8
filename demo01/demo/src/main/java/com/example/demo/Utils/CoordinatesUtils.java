package com.example.demo.Utils;

import com.alibaba.fastjson.JSONObject;
import com.example.demo.Entity.LineString;
import com.example.demo.Entity.Point;
import com.example.demo.Entity.Polygon;

import java.util.ArrayList;
import java.util.List;

public final class CoordinatesUtils {
    public static Point StringToPoint(String coordinatesString) {
        ArrayList<Double> co = (ArrayList<Double>) JSONObject.parseArray(coordinatesString, Double.class);
        return new Point(co.get(0), co.get(1));
    }

    public static LineString StringToLineString(String coordinatesString) {
        ArrayList<String> co = (ArrayList<String>) JSONObject.parseArray(coordinatesString, String.class);
        List<Point> points = new ArrayList<>();
        for (int i = 0; i < co.size(); i++){
            String point = co.get(i);
            Point newPoint = CoordinatesUtils.StringToPoint(point);
            points.add(newPoint);
        }

        return new LineString(points);
    }

    public static Polygon StringToPolygon(String coordinatesString){
        ArrayList<String> lines = (ArrayList<String>) JSONObject.parseArray(coordinatesString, String.class);
        ArrayList<String> pointsString = (ArrayList<String>) JSONObject.parseArray(lines.get(0),String.class);
        ArrayList<String> pointsString1 = (ArrayList<String>) JSONObject.parseArray(pointsString.get(0),String.class);
        List<Point> points = new ArrayList<>();
        for (int i = 0; i < pointsString1.size();i++){
            String point = pointsString1.get(i);
            Point newPoint = CoordinatesUtils.StringToPoint(point);
            points.add(newPoint);
        }
        return new Polygon(points);
    }

    public static Point calculateCenter(List<Point> coordinates){
        double totalX = 0;
        double totalY = 0;

        for (Point point : coordinates) {
            totalX += point.getLatitude();
            totalY += point.getLongitude();
        }

        double centerX = totalX / coordinates.size();
        double centerY = totalY / coordinates.size();

        return new Point(centerY, centerX);
    }
}


