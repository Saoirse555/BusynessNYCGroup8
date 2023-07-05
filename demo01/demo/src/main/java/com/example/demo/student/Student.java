package com.example.demo.student;

import lombok.*;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private long id;
    private String name;
    private String email;
    private Gender gender;


}
