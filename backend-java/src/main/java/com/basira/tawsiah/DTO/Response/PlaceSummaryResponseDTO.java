package com.basira.tawsiah.DTO.Response;

import com.basira.tawsiah.Model.valueObjects.Schedule;

import lombok.Data;

// @Author: Rahq05
//
//
// Date and time: 10 March 3:40AM

@Data
public class PlaceSummaryResponseDTO {

    private Long id;

    private String name ;
    
    private String description;

    private String city;

    private String imageURL;

    private String category;

    private Double rate;

    private Schedule schedule;


    public PlaceSummaryResponseDTO() {
    }


    public PlaceSummaryResponseDTO(Long id, String name, String description, String city, String imageURL, String category, Double rate, Schedule schedule) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.city = city;
        this.imageURL = imageURL;
        this.category = category;
        this.rate = rate;
        this.schedule = schedule;
    }


    public Schedule getSchedule() {
        return this.schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
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

    public String getImageURL() {
        return this.imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
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


   
}
