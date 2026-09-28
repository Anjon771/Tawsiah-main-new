package com.basira.tawsiah.DTO.Response;

import com.basira.tawsiah.Model.valueObjects.Schedule;

import lombok.Data;

@Data
public class EventSummaryDTO {
    

    private Long id;

    private String imageUrl;

    private String name;

    private String description;
    
    private String city;

    private String category;

    private Double rate;

    private String price;

    private Schedule Schedule;

    /**
     * 0–100 relevance score populated by the recommendation engine.
     * Higher = more relevant to the user's preferences, rating, and proximity.
     */
    private Integer relevanceScore;

    private String type;

    public EventSummaryDTO() {
    }



    public EventSummaryDTO(Long id, String imageUrl, String name, String description, String city, String category, Double rate, String price, Schedule Schedule) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.description = description;
        this.city = city;
        this.category = category;
        this.rate = rate;
        this.price = price;
        this.Schedule = Schedule;
    }
   



    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }
   

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public String getPrice() {
        return this.price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Schedule getSchedule() {
        return this.Schedule;
    }

    public void setSchedule(Schedule Schedule) {
        this.Schedule = Schedule;
    }

    public Integer getRelevanceScore() {
        return this.relevanceScore;
    }

    public void setRelevanceScore(Integer relevanceScore) {
        this.relevanceScore = relevanceScore;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
