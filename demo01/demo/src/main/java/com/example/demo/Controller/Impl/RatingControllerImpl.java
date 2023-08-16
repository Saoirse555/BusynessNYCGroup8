package com.example.demo.Controller.Impl;

import com.example.demo.Controller.RatingController;
import com.example.demo.Entity.Rating;
import com.example.demo.Service.Impl.RatingServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping(path = "automate_api/v1/rating")
@CrossOrigin(origins = "*")
public class RatingControllerImpl implements RatingController {
    private final RatingServiceImpl ratingService;

    @Override
    @GetMapping
    public float getCalculatedRating() {
        return ratingService.getCalculatedRating();
    }

    @Override
    @PostMapping
    public boolean saveUserRating(@RequestBody String rating) {
        Float ratingRating = Float.valueOf(rating);
        return ratingService.saveUserRating(ratingRating);
    }
}
