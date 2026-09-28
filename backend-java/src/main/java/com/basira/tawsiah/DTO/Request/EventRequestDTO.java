package com.basira.tawsiah.DTO.Request;



import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;

import jakarta.validation.Valid;





public class EventRequestDTO {

    
    private String name;

    private String description;

    private String category;

    private String city;

    private Double price ;

    private String imageUrl;

    private Double rate;

    @Valid
    private Schedule schedule;
    
    @Valid
    private Location location;



    public EventRequestDTO(String name, String description, String category, String city, Location location, Double price, String imageUrl, Double rate, Schedule schedule) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.city = city;
        this.location = location;
        this.price = price;
        this.imageUrl = imageUrl;
        this.rate = rate;
        this.schedule = schedule;
    }
    
    
    public EventRequestDTO() {
    }



    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
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

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Double getPrice() {
        return this.price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Schedule getSchedule() {
        return this.schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }   
}
