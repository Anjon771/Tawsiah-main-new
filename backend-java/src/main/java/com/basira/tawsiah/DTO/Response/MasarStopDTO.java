package com.basira.tawsiah.DTO.Response;

import lombok.Data;

@Data
public class MasarStopDTO {

    private Integer stopNumber;
    private Long placeId;
    private String name;
    private String city;
    private String category;
    private String description;
    private String priceDisplay;
    private Double rate;
    private String imageUrl;
    private String type;

    public MasarStopDTO() {
    }

    public MasarStopDTO(Integer stopNumber, Long placeId, String name, String city,
                        String category, String description, String priceDisplay,
                        Double rate, String imageUrl, String type) {
        this.stopNumber = stopNumber;
        this.placeId = placeId;
        this.name = name;
        this.city = city;
        this.category = category;
        this.description = description;
        this.priceDisplay = priceDisplay;
        this.rate = rate;
        this.imageUrl = imageUrl;
        this.type = type;
    }

    public Integer getStopNumber() {
        return stopNumber;
    }

    public void setStopNumber(Integer stopNumber) {
        this.stopNumber = stopNumber;
    }

    public Long getPlaceId() {
        return placeId;
    }

    public void setPlaceId(Long placeId) {
        this.placeId = placeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriceDisplay() {
        return priceDisplay;
    }

    public void setPriceDisplay(String priceDisplay) {
        this.priceDisplay = priceDisplay;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
