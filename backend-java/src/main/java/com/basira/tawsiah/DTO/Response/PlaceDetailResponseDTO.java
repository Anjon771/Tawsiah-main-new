package com.basira.tawsiah.DTO.Response;

import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;

import lombok.Data;

// @Author: Rahq05
//
//
// Date and time: 10 March 3:40AM

@Data
public class PlaceDetailResponseDTO {
    
    private Long id;

    private String name ;
    
    private String description;

    private String city;

    private String category;

    private String imageURL;

    private Double rate;

    private Location location;

    private Schedule schedule;

    private String type;


    public PlaceDetailResponseDTO() {
    }


    public PlaceDetailResponseDTO(Long id, String name, String description, String city, String category, String imageURL, Double rate, Location location, Schedule schedule) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.city = city;
        this.category = category;
        this.imageURL = imageURL;
        this.rate = rate;
        this.location = location;
        this.schedule = schedule;
    }
    



    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Schedule getSchedule() {
        return this.schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }


    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
    

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getImageURL() {
        return this.imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    



}
