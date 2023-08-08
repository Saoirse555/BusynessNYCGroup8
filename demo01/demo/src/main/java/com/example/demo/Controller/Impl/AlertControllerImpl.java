package com.example.demo.Controller.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

// https://511ny.org/api/getevents?key=5fcac6b5dc2c4372a0416f46929d4cc1&format=json

@RestController
@CrossOrigin(origins = "*")
public class AlertControllerImpl {
    @Autowired
    private RestTemplate restTemplate;

    @GetMapping(path = "/automate_api/v1/get_alert")
    public String getAlert(){
        String url = "https://511ny.org/api/getevents?key=5fcac6b5dc2c4372a0416f46929d4cc1&format=json";
        ResponseEntity<String> results = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
        String json = results.getBody();
        return json;
    }
}