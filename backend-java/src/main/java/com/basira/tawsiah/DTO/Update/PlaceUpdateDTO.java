package com.basira.tawsiah.DTO.Update;


import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;

import jakarta.validation.constraints.NotBlank;

public class PlaceUpdateDTO {
    
    @NotBlank
    private String name ;
    
    @NotBlank
    private String description;

    @NotBlank
    private String category;

    @NotBlank
    private String city;

    @NotBlank
    private String imageURL;

   private Location location;

    private Schedule schedule;
   
    public PlaceUpdateDTO(){
        //empty constructor for Jackson(JSON) to work | mandatroy!
    }


    public PlaceUpdateDTO(String name, String description, String category, String city, String imageURL, Location location, Schedule schedule) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.city = city;
        this.imageURL = imageURL;
        this.location = location;
        this.schedule = schedule;
    }
    

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
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


