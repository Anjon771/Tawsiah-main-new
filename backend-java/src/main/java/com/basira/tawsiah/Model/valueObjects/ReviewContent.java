package com.basira.tawsiah.Model.valueObjects;

import java.time.LocalDateTime;

import jakarta.persistence.Embeddable;

@Embeddable
public class ReviewContent {

    private Integer rating; // from 1 to 5
    private String comment; // optional text feedback
    private LocalDateTime createdAt; // timestamp of when the review was created

    // Getters and Setters
    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
