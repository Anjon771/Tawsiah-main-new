package com.basira.tawsiah.Model.Entities;

import com.basira.tawsiah.Model.valueObjects.ReportDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // to link the report to the user and place, we can use their IDs. In a real application, we might want to have relationships to User and Place entities instead.
    @Column(nullable = false)
    private Long userId; // reporter's user ID

    @Column(nullable = false)
    private Long placeId; // places or events can be reported, so we can use a generic placeId that can refer to either. In a real application, we might want to have separate fields or a more complex structure to handle this.

    @Embedded
    private ReportDetails details; // using value object for the report details

    @Enumerated(EnumType.STRING)
    private ReportStatus status; // PENDING, RESOLVED, REJECTED

    private String adminComment; // Admins can add comments when resolving or rejecting a report, to provide feedback to the user.
    
    //########################## Enums ###########################
    
    public enum ReportStatus { 
        PENDING, RESOLVED, REJECTED
    }


    //########################## Getters and Setters ##########################

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getPlaceId() {
        return placeId;
    }

    public ReportDetails getDetails() {
        return details;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public String getAdminComment() {
        return adminComment;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setPlaceId(Long placeId) {
        this.placeId = placeId;
    }

    public void setDetails(ReportDetails details) {
        this.details = details;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }
    
}
