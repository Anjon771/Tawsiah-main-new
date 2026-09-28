package com.basira.tawsiah.Model.Entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity

@Table(name="ratings", uniqueConstraints = {
    @UniqueConstraint(
        name = "unique_daily_user_rating", 
        columnNames = {"user_id", "event_id", "rating_date"}
    )
})
public class Rating {
   
    @ManyToOne
    @JoinColumn(name = "Event_id",unique = true)
    private Event event;

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Double rating;

    // Ewan : I added this to link the rating to the user who made it, but we can remove it if we want to keep ratings anonymous
    @ManyToOne
    @JoinColumn(name = "user_id",unique = true)
    private User user;

    @Column(name = "rating_date", nullable = false)
    private LocalDate ratingDate;

    @Column(name = "comment", length = 2000)
    private String comment;

    @Column(name = "user_name")
    private String userName;

    public Rating() {
    }

    public Rating(Event event, Long id, Double rating) {
        this.event = event;
        this.id = id;
        this.rating = rating;
    }


    public LocalDate getRatingDate() {
        return this.ratingDate;
    }

    public void setRatingDate(LocalDate ratingDate) {
        this.ratingDate = ratingDate;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getRating() {
        return this.rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return this.comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
