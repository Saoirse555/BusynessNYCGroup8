package com.example.demo.integration;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-it.properties")
@AutoConfigureMockMvc
public class RatingIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void canGetCalculatedRating() throws Exception{

        // when
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get("/automate_api/v1/rating")
                .contentType(MediaType.APPLICATION_JSON));

        // then
        resultActions
                .andExpect(status().isOk())   // Asserts that the response status is 200 OK
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)); // Asserts that the content type is JSON
    }

    @Test
    void canSaveUserRating() throws Exception{
        // given
        String rating = "5.0";

        // when
        ResultActions resultActions = mockMvc
                .perform(MockMvcRequestBuilders.post("/automate_api/v1/rating")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(rating));

        // then
        resultActions.andExpect(status().isOk()) // Asserts that the response status is 200 OK
                .andExpect(content().string("true")); // Asserts the response content

    }
}
