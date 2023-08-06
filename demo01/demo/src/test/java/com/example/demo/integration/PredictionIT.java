package com.example.demo.integration;

import com.example.demo.Entity.ModelInput;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-it.properties")
@AutoConfigureMockMvc
public class PredictionIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void canGetPredictionResults() throws Exception {
        // given
        ModelInput modelInput = new ModelInput(
                15,
                7,
                22,
                6,
                3.76,
                10,
                0.0,
                26.1
        );
        // when
        ResultActions resultActions = mockMvc
                .perform(MockMvcRequestBuilders.post("/automate_api/v1/prediction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(modelInput)));
        // then
        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())   // Asserts that the response status is 200 OK
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // Asserts that the content type is JSON
                .andExpect(jsonPath("$").isArray()) // Asserts that the root object is an array (List)
                .andExpect(jsonPath("$.length()").value(66));   // Asserts that the array has 66 elements
    }
}
