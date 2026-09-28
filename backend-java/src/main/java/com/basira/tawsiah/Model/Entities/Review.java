package com.basira.tawsiah.Model.Entities;

import com.basira.tawsiah.Model.valueObjects.ReviewContent;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // user who wrote the review
    private Long placeId; // Get from recommendation or event service

    @Embedded
    private ReviewContent content; // <------ for objectValue
    
    // Getters and Setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getPlaceId() {
        return placeId;
    }

    public ReviewContent getContent() {
        return content;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setPlaceId(Long placeId) {
        this.placeId = placeId;
    }

    public void setContent(ReviewContent content) {
        this.content = content;
    }

}
