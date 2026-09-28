package com.basira.tawsiah.Model.Entities;

import java.util.ArrayList;
import java.util.List;

import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name="events", uniqueConstraints = {
    @UniqueConstraint(name = "unique_event_occurrence", columnNames = {"name", "city", "date"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = "places")
public class Event {

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Place> places = new ArrayList<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique=true)
    private String name;

    @Column
    private String category;

    @Column
    private String description;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String price;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = true) 
    private Double rate;

    @Embedded
    private Location location;

    @Embedded
    private Schedule schedule;

    // this annotaion is basically @IgnoreDatabase. saved in JSON messages but not database
    @Transient
    private String type = "event";

    public List<Place> getPlaces() {
        return this.places;
    }

    public void setPlaces(List<Place> places) {
        this.places = places;
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

    public String getCategory() {
        return this.category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getPrice() {
        return this.price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getRate() {
        return this.rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
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

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
