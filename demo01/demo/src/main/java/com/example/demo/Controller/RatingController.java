package com.example.demo.Controller;

import com.example.demo.Entity.Rating;

public interface RatingController {
    float getCalculatedRating();

    boolean saveUserRating(String rating);
}
