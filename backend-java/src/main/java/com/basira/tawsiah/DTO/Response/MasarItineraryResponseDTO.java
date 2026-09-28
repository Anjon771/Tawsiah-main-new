package com.basira.tawsiah.DTO.Response;

import java.util.List;

import lombok.Data;

@Data
public class MasarItineraryResponseDTO {

    private List<MasarStopDTO> items;
    private Double budget;
    private Integer totalItems;
    private Double estimatedTotalCost;

    public MasarItineraryResponseDTO() {
    }

    public MasarItineraryResponseDTO(List<MasarStopDTO> items, Double budget,
                                     Integer totalItems, Double estimatedTotalCost) {
        this.items = items;
        this.budget = budget;
        this.totalItems = totalItems;
        this.estimatedTotalCost = estimatedTotalCost;
    }

    public List<MasarStopDTO> getItems() {
        return items;
    }

    public void setItems(List<MasarStopDTO> items) {
        this.items = items;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public Double getEstimatedTotalCost() {
        return estimatedTotalCost;
    }

    public void setEstimatedTotalCost(Double estimatedTotalCost) {
        this.estimatedTotalCost = estimatedTotalCost;
    }
}
