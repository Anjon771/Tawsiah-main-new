package com.basira.tawsiah.DTO.Response;

public class RatingResponseDTO {

    private Long id;

    private Long eventID;

    private String eventName;

    private String imageUrl;

    private Double rating;

    private String comment;

    private String userName;

    private String date;

    public RatingResponseDTO() {
    }

    public RatingResponseDTO(Long id, Long eventID, Double rating) {
        this.id = id;
        this.eventID = eventID;
        this.rating = rating;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventID() {
        return this.eventID;
    }

    public void setEventID(Long eventID) {
        this.eventID = eventID;
    }

    public Double getRating() {
        return this.rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
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

    public String getEventName() {
        return this.eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

}
