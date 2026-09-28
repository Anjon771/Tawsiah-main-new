package com.basira.tawsiah.DTO.Response;


import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;

import lombok.Data;

@Data
public class EventDetailedResponseDTO {


    private Long id;
    
    private String imageUrl;

    private String name;

    private String description;
    
    private String city;

    private Double rate;

    private String price;

    private Schedule schedule;

    private String category;

    private Location location;

    private String type;



    public EventDetailedResponseDTO(Long id, String imageUrl, String name, String description, String city, Double rate, String price, Schedule schedule, String category, Location location) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.description = description;
        this.city = city;
        this.rate = rate;
        this.price = price;
        this.schedule = schedule;
        this.category = category;
        this.location = location;
    }
  


    public EventDetailedResponseDTO() {
    }



    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
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
        return this.schedule;
    }

    public void setSchedule(Schedule Schedule) {
        this.schedule = Schedule;
    }

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }



    // category , location, 

}
