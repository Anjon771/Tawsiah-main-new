package com.basira.tawsiah.DTO.Response;

import java.util.List;

import lombok.Data;

@Data
public class RecommendationResponseDTO {

    private List<EventSummaryDTO> events;

    private List<EventSummaryDTO> scoredItems;

    private String strategy;

    public RecommendationResponseDTO(List<EventSummaryDTO> events, String strategy) {
        this.events = events;
        this.strategy = strategy;
    }

    public RecommendationResponseDTO() {
    }

    public List<EventSummaryDTO> getEvents() {
        return this.events;
    }

    public void setEvents(List<EventSummaryDTO> events) {
        this.events = events;
    }

    public String getStrategy() {
        return this.strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }
}
