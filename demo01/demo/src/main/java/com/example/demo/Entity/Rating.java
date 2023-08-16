package com.example.demo.Entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Getter
@Setter
@Entity
@Table(name = "rating")
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Rating {
    @Id
    @SequenceGenerator(name = "rating_id_seq",
    sequenceName = "rating_id_seq",
    allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
    generator = "rating_id_seq")
    private Long rating_id;
    private Float rating;
    private Date date;

    public Rating(Float rating, Date date) {
        this.rating = rating;
        this.date = date;
    }






}
