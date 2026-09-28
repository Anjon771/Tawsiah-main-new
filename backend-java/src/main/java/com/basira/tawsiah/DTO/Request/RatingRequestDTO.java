package com.basira.tawsiah.DTO.Request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class RatingRequestDTO {

    @NotNull(message = "event id is null")
    private Long eventId;

    @NotNull(message = "rating value is requierd")
    @DecimalMin(value = "1.0", message = "Minimum rating is 1.0")
    @DecimalMax(value = "5.0", message = "Maximum rating is 5.0")
    private Double rating;

    private Long userID;

    private String comment;

    private String userName;

    public RatingRequestDTO() {
    }

    public RatingRequestDTO(Long eventId, Double rating) {
        this.eventId = eventId;
        this.rating = rating;
    }

    public Long getUserID() {
        return this.userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getComment() {
        return this.comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getEventId() {
        return this.eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }    

    public Double getRating() {
        return this.rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

}
