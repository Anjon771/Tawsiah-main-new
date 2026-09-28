// @Author: Rahq05
//
//
// Date and time: 10 March 12:26PM

package com.basira.tawsiah.DTO.Request;

import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PlaceRequest {

    // @NotNull
    // private Long id; // :R check if i need validation here for id

    @NotBlank
    private String name ;

    @NotBlank
    private String description;

    @NotBlank
    private String category;

    @NotBlank
    private String city;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String imageURL;

    private Location location;

    @NotNull
    private Double rate;

    private Schedule schedule;


    public PlaceRequest(){
        //empty constructor for Jackson(JSON) to work | mandatroy!
    }


    public PlaceRequest(String name, String description, String category, String city, String imageURL, Location location, Double rate, Schedule schedule) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.city = city;
        this.imageURL = imageURL;
        this.location = location;
        this.rate = rate;
        this.schedule = schedule;
    }



    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }


    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Schedule getSchedule() {
        return this.schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
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


    public String getImageURL() {
        return this.imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }









}
