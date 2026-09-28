package com.basira.tawsiah.Model.Entities;

import java.util.List;

import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "places", uniqueConstraints = {
    @UniqueConstraint(
        name = "unique_place_location",
        columnNames = {"name", "latitude", "longitude"}
    )
})
@Data
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = "event")
public class Place {

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = true)
    @JsonBackReference
    private Event event; 
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;

    @Column(nullable=false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String category;

    
    private Double price;

    @Embedded
    private Location location; 

    @Embedded
    private Schedule schedule;

    @Column(nullable = true, columnDefinition = "TEXT") // Rahq05: some flixability for places with no images
    private String imageURL;

    private List<String> photos;
      
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = true)
    private Integer currentCrowdDensity; // [very high, high , medium , low , very low]

    @Column
    private Double rate; //R: it's okay if null in case of no ratings or visit for place 

    // this annotaion is basically @IgnoreDatabase. saved in JSON messages but not database
    @Transient
    private String type = "place";

   

   
// ############################ Setters and Getters ############################


    public Place(Long ID, String name, String description, String category, Double price, Location location, Schedule schedule, String imageURL, java.util.List<String> photos, String city, Integer currentCrowdDensity, Double rate, String type) {
        this.ID = ID;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.location = location;
        this.schedule = schedule;
        this.imageURL = imageURL;
        this.photos = photos;
        this.city = city;
        this.currentCrowdDensity = currentCrowdDensity;
        this.rate = rate;
        this.type = type;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Long getID() {
        return this.ID;
    }

    public void setID(Long ID) {
        this.ID = ID;
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

    public Double getPrice() {
        return this.price;
    }

    public void setPrice(Double price) {
        this.price = price;
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

    public String getImageURL() {
        return this.imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public List<String> getPhotos() {
        return this.photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getCurrentCrowdDensity() {
        return this.currentCrowdDensity;
    }

    public void setCurrentCrowdDensity(Integer currentCrowdDensity) {
        this.currentCrowdDensity = currentCrowdDensity;
    }

    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
