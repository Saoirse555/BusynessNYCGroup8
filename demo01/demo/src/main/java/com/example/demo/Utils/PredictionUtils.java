package com.example.demo.Utils;

import com.example.demo.Entity.ModelInput;
import org.dmg.pmml.FieldName;
import org.dmg.pmml.PMML;
import org.jpmml.evaluator.*;
import org.jpmml.model.PMMLUtil;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

public final class PredictionUtils {
    static Evaluator modelEvaluator;

    static void loadPMML(int locationId) {
        String modelPath = "xgboost_models_forEach/model_" + locationId + ".pmml";
        PMML pmml;
        try {
            Resource resource = new ClassPathResource(modelPath);
            InputStream is = resource.getInputStream();
            pmml = PMMLUtil.unmarshal(is);
            try {
                is.close();
            } catch (IOException e) {
                System.out.println("InputStream close error!");
            }
            ModelEvaluatorBuilder modelEvaluatorBuilder = new ModelEvaluatorBuilder(pmml);
            ModelEvaluatorFactory modelEvaluatorFactory = ModelEvaluatorFactory.newInstance();
            modelEvaluatorBuilder.setModelEvaluatorFactory(modelEvaluatorFactory);
            modelEvaluator = modelEvaluatorBuilder.build();
            modelEvaluator.verify();
//            System.out.println("Model loaded successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Get needed feature names
     *
     * @return feature name
     */
    public static List<String> getFeatureNames() {
        List<String> featureNames = new ArrayList<>();
        List<InputField> inputFields = modelEvaluator.getInputFields();
        for (InputField inputField : inputFields) {
            featureNames.add(inputField.getName().toString());
        }
        return featureNames;
    }

    /**
     * Get target name
     *
     * @return target name
     */
    public static String getTargetName() {
        return modelEvaluator.getTargetFields().get(0).getName().toString();
    }

    /**
     * Load raw input data
     *
     * @param hour model feature
     * @param month model feature
     * @param day model feature
     * @param day_of_week model feature
     * @param wind_spd model feature
     * @param vis model feature
     * @param precip model feature
     * @param temp model feature
     * @return model needed map
     */
    Map<String, Object> getRawMap(Object timeslot, Object hour, Object month, Object day, Object day_of_week,
                                  Object wind_spd, Object vis, Object precip, Object temp) {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("timeslot", timeslot);
        data.put("x1", temp);
        data.put("x2", precip);
        data.put("x3", vis);
        data.put("x4", wind_spd);
        data.put("x5", day_of_week);
        data.put("x6", day);
        data.put("x7", month);
        data.put("x8", hour);
        return data;
    }

    /**
     * Transfer raw input map to PMML needed map
     *
     * @param evaluator model evaluator
     * @param input model input
     * @return model input
     */
    private Map<FieldName, FieldValue> getFieldMap(Evaluator evaluator, Map<String, Object> input) {
        List<InputField> inputFields = evaluator.getInputFields();
        Map<FieldName, FieldValue> map = new LinkedHashMap<FieldName, FieldValue>();
        for (InputField field : inputFields) {
            FieldName fieldName = field.getName();
            Object rawValue = input.get(fieldName.getValue());
            FieldValue value = field.prepare(rawValue);
            map.put(fieldName, value);
        }
        return map;
    }

    /**
     * process of evaluate
     *
     * @param evaluator
     * @param input
     * @return
     */
    private Map<String, Object> evaluate(Evaluator evaluator, Map<FieldName, FieldValue> input) {
        Map<FieldName, ?> results = evaluator.evaluate(input);
        List<TargetField> targetFields = evaluator.getTargetFields();
        Map<String, Object> output = new LinkedHashMap<String, Object>();
        for (TargetField field : targetFields) {
            FieldName fieldName = field.getName();
            Object value = results.get(fieldName);
            if (value instanceof Computable) {
                Computable computable = (Computable) value;
                value = computable.getResult();
            }
            output.put(fieldName.getValue(), value);
        }
        return output;
    }


    /**
     * make prediction
     *
     * @param evaluator
     * @param data
     * @return
     */
    Map<String, Object> predict(Evaluator evaluator, Map<String, Object> data) {
        Map<FieldName, FieldValue> input = getFieldMap(evaluator, data);
        return evaluate(evaluator, input);
    }


    /**
     * get model input and make prediction
     * @param modelInput model input
     * @return result
     */
    public static double makePrediction(int locationID, ModelInput modelInput) {
        //load model
        loadPMML(locationID);

        //make prediction
        PredictionUtils predictionUtils = new PredictionUtils();
        String timeslot;
        if (modelInput.getHour() < 12 & modelInput.getHour() >= 6) {
            timeslot = "Morning";
        } else if (modelInput.getHour() < 17 & modelInput.getHour() >= 12) {
            timeslot = "Afternoon";
        } else if (modelInput.getHour() < 22 & modelInput.getHour() >= 17) {
            timeslot = "Evening";
        } else {
            timeslot = "Late Night";
        }
        Map<String, Object> input = predictionUtils.getRawMap(timeslot,modelInput.getHour(),modelInput.getMonth(),
                modelInput.getDay(), modelInput.getDayOfWeek(), modelInput.getWindSpd(), modelInput.getVis(),
                modelInput.getPrecip(), modelInput.getTemp());
        Map<String, Object> output = predictionUtils.predict(modelEvaluator, input);

        //get result
        Object result = output.get("y");
        return (double) result;
    }
}
