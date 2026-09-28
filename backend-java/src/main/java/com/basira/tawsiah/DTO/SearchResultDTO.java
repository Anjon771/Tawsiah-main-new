package com.basira.tawsiah.DTO;

import java.util.List;

import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;

public class SearchResultDTO {
    
    
    // Place list for search results (using PlaceSummaryResponseDTO for summary info)
    private List<PlaceSummaryResponseDTO> places;
    
    // create a list of EventSummaryDTO to hold event search results
    private List<EventSummaryDTO> events;

   public SearchResultDTO() {}

    // هذا هو الـ Constructor الذي كان يسبب الخطأ في الصورة الرابعة
    public SearchResultDTO(List<PlaceSummaryResponseDTO> places, List<EventSummaryDTO> events) {
        this.places = places;
        this.events = events;
    }

    // Getters and Setters
    public List<PlaceSummaryResponseDTO> getPlaces() { return places; }
    public void setPlaces(List<PlaceSummaryResponseDTO> places) { this.places = places; }

    public List<EventSummaryDTO> getEvents() { return events; }
    public void setEvents(List<EventSummaryDTO> events) { this.events = events; }
}
