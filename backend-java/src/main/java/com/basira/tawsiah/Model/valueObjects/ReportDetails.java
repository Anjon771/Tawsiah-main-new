package com.basira.tawsiah.Model.valueObjects;

import java.time.LocalDateTime;

import jakarta.persistence.Embeddable;

@Embeddable
public class ReportDetails {
    private String issueType; // e.g., "Inappropriate Content", "Spam", "Harassment"
    private String description; // User's description of the issue
    private String urgencyLevel; // e.g., "Low", "Medium", "High"
    private LocalDateTime reportedAt; // Timestamp of when the report was made
    
    // Getters and Setters
    public String getIssueType() {
        return issueType;
    }
    public String getDescription() {
        return description;
    }
    public String getUrgencyLevel() {
        return urgencyLevel;
    }
    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUrgencyLevel(String urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }
}
