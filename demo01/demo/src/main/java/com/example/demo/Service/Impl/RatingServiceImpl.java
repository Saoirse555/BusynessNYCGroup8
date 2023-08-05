package com.example.demo.Service.Impl;

import com.example.demo.Entity.Rating;
import com.example.demo.Repository.RatingRepository;
import com.example.demo.Service.RatingService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.BatchUpdateException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@AllArgsConstructor
public class RatingServiceImpl implements RatingService {
    private RatingRepository ratingRepository;

    @Override
    public float getCalculatedRating() {
        //get all stored ratings
        List<Rating> ratings = ratingRepository.findAll();

        //calculate total rating
        float sum = 0;
        for (Rating rating : ratings
        ) {
            sum += rating.getRating();
        }

        return sum / ratings.size();
    }

    @Override
    public boolean saveUserRating(Float rating) {
        Rating userRating = new Rating(rating, Date.valueOf(LocalDate.now()));
        try {
            ratingRepository.save(userRating);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Save failed.");
            return false;
        }

        return true;
    }
}
