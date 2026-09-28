package com.basira.tawsiah.DTO;

import java.util.List;


public class MapPointDTO {

    private Long id;
    private String googlePlaceId;
    private String name;
    private List<String> categories;
    private boolean isEvent;
    private int rating;
    private Double rate;
    private String imageUrl;
    private String price;
    private String date;
    private String city;

    private LocationDTO location;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGooglePlaceId() {
        return this.googlePlaceId;
    }

    public void setGooglePlaceId(String googlePlaceId) {
        this.googlePlaceId = googlePlaceId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getCategories() {
        return this.categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public boolean isIsEvent() {
        return this.isEvent;
    }

    public boolean getIsEvent() {
        return this.isEvent;
    }

    public void setIsEvent(boolean isEvent) {
        this.isEvent = isEvent;
    }

    public int getRating() {
        return this.rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPrice() {
        return this.price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocationDTO getLocation() {
        return this.location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }
}
