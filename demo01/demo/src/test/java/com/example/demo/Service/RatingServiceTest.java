package com.example.demo.Service;

import com.example.demo.Entity.Rating;
import com.example.demo.Repository.RatingRepository;
import com.example.demo.Service.Impl.RatingServiceImpl;
import org.assertj.core.api.Assertions;
import org.assertj.core.api.AssertionsForClassTypes;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;
    private RatingServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new RatingServiceImpl(ratingRepository);
    }

    @Test
    void getCalculatedRating() {
        //when
        underTest.getCalculatedRating();
        //then
        List<Rating> ratingList = Mockito.verify(ratingRepository).findAll();
        //given
        List<Rating> ratings = Arrays.asList(
                new Rating(5.0f, Date.valueOf(LocalDate.now())),
                new Rating(4.0f, Date.valueOf(LocalDate.now())),
                new Rating(3.0f, Date.valueOf(LocalDate.now()))
        );

        //when
        when(ratingRepository.findAll()).thenReturn(ratings);
        float calculatedRating = underTest.getCalculatedRating();

        //then
        assertEquals(4.0f, calculatedRating, 0.01);
    }

    @Test
    void saveUserRating() {
        //given
        Float rating = 5.0F;
        Rating userRating = new Rating(rating, Date.valueOf(LocalDate.now()));

        //when
        underTest.saveUserRating(userRating.getRating());

        //then
        ArgumentCaptor<Rating> ratingArgumentCaptor = ArgumentCaptor.forClass(Rating.class);
        Mockito.verify(ratingRepository).save(ratingArgumentCaptor.capture());

        Rating ratingCaptured = ratingArgumentCaptor.getValue();
        AssertionsForClassTypes.assertThat(ratingCaptured.getRating()).isEqualTo(userRating.getRating());
    }

    @Test
    void saveRatingFailed() {
        // given
        float userRating = 6.0f;

        // when
        doThrow(new RuntimeException()).when(ratingRepository).save(any(Rating.class));
        boolean result = underTest.saveUserRating(userRating);

        // then
        assertFalse(result);
    }
}