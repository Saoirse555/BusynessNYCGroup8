package com.example.demo.Service;

public interface RatingService {
    float getCalculatedRating();

    boolean saveUserRating(Float rating);
}
