package com.example.demo.Utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.example.demo.Utils.PredictionUtils.loadPMML;
import static com.example.demo.Utils.PredictionUtils.modelEvaluator;

public class PredictionOutputDemoUtils {
    public static void main(String[] args) throws IOException {
        PredictionUtils predictionUtils = new PredictionUtils();

        List<Map<String, Object>> inputs = new ArrayList<>();
        List<Integer> locationIDs = new ArrayList<>();
        locationIDs.add(4);
        locationIDs.add(127);
        locationIDs.add(12);
        locationIDs.add(13);
        locationIDs.add(243);

        //4
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 1, 5, 1.6, 10, 0.0, 10.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 2, 6, 2.9, 9, 1.5, 11.4));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 7, 4, 3.1, 10, 2.5, 0.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 8, 5, 4.3, 10, 0.0, -3.9));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 9, 6, 3.1, 10, 0.0, -1.4));
        //127
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 1, 5, 1.6, 10, 0.0, 10.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 2, 6, 2.9, 9, 1.5, 11.4));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 7, 4, 3.1, 10, 2.5, 0.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 8, 5, 4.3, 10, 0.0, -3.9));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 9, 6, 3.1, 10, 0.0, -1.4));
        //12
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 1, 5, 1.6, 10, 0.0, 10.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 7, 4, 3.1, 10, 2.5, 0.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 22, 5, 4.6, 10, 0.0, -7.8));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 23, 6, 3.8, 10, 0.0, -3.0));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 29, 5, 4.7, 1, 0.3, -1.9));
        //13
        inputs.add(predictionUtils.getRawMap("Late Night", 5, 11, 9, 2, 2.6, 10, 0.0, 5));
        inputs.add(predictionUtils.getRawMap("Morning", 7, 8, 10, 2, 2.6, 10, 0, 24.4));
        inputs.add(predictionUtils.getRawMap("Late Night", 4, 7, 2, 5, 4.4, 10, 0, 25.6));
        inputs.add(predictionUtils.getRawMap("Morning", 9, 11, 9, 2, 3.6, 10, 0.0, 6.7));
        inputs.add(predictionUtils.getRawMap("Evening", 21, 6, 30, 3, 2.4, 10, 0.0, 24.4));
        //243
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 1, 5, 1.6, 10, 0.0, 10.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 2, 6, 2.9, 9, 1.5, 11.4));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 7, 4, 3.1, 10, 2.5, 0.6));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 8, 5, 4.3, 10, 0.0, -3.9));
        inputs.add(predictionUtils.getRawMap("Late Night", 0, 1, 9, 6, 3.1, 10, 0.0, -1.4));


        //output
        String outputPath = "output.txt";
        File outputFile = new File(outputPath);
        FileWriter fileWriter = new FileWriter(outputFile);
        BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

        for (int i = 0; i < locationIDs.size(); i++) {
            int id = locationIDs.get(i);
            loadPMML(id);
            System.out.println("Model: " + id);
            bufferedWriter.write("Model: " + id);
            bufferedWriter.newLine();
            for (int j = i * 5; j < i * 5 + 5; j++) {
                Map<String, Object> outputTest = predictionUtils.predict(modelEvaluator, inputs.get(j));
                List<String> featureNames = PredictionUtils.getFeatureNames();
//                System.out.println(featureNames);
                System.out.println("X=" + inputs.get(j) + " -> y=" + outputTest.get("y"));
                bufferedWriter.write("X=" + inputs.get(j) + " -> y=" + outputTest.get("y"));
                bufferedWriter.newLine();
            }
        }

        bufferedWriter.close();
    }
}
