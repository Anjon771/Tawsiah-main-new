package com.basira.tawsiah.DTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.basira.tawsiah.DTO.Response.RatingResponseDTO;

public class UserProfileResponseDTO {

   private String name;
    private String email;
    private String language;
    private String avatarUrl;
    private LocalDateTime nameLastUpdatedAt;
    private boolean canUpdateName;

    // to get insights about the user, we can include some statistics like:
    private Map<String, Integer> stats;

    private List<InterestDTO> interests;

    // to get insights about the user, we can include some statistics like:
    private List<Object> favorites;
    private List<Object> visited;
    private List<RatingResponseDTO> reviews;
    
    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Map<String, Integer> getStats() {
        return stats;
    }

    public void setStats(Map<String, Integer> stats) {
        this.stats = stats;
    }

    public List<InterestDTO> getInterests() {
        return interests;
    }

    public void setInterests(List<InterestDTO> interests) {
        this.interests = interests;
    }

    public List<Object> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<Object> favorites) {
        this.favorites = favorites;
    }

    public List<Object> getVisited() {
        return visited;
    }

    public void setVisited(List<Object> visited) {
        this.visited = visited;
    }

    public List<RatingResponseDTO> getReviews() {
        return reviews;
    }

    public void setReviews(List<RatingResponseDTO> reviews) {
        this.reviews = reviews;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getNameLastUpdatedAt() {
        return nameLastUpdatedAt;
    }

    public void setNameLastUpdatedAt(LocalDateTime nameLastUpdatedAt) {
        this.nameLastUpdatedAt = nameLastUpdatedAt;
    }

    public boolean isCanUpdateName() {
        return canUpdateName;
    }

    public void setCanUpdateName(boolean canUpdateName) {
        this.canUpdateName = canUpdateName;
    }
}