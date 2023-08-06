package com.example.demo.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-it.properties")
@AutoConfigureMockMvc
public class ChargingStationIT {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void canGetAllChargingStations() throws Exception {

        // when
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get("/automate_api/v1/charging-stations")
                .contentType(MediaType.APPLICATION_JSON));

        // then
        resultActions
                .andExpect(status().isOk())   // Asserts that the response status is 200 OK
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // Asserts that the content type is JSON
                .andExpect(jsonPath("$").isArray()); // Asserts that the root object is an array (List)

    }
}
