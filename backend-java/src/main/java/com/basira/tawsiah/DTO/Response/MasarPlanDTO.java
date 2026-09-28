package com.basira.tawsiah.DTO.Response;

import java.util.List;

import lombok.Data;

@Data
public class MasarPlanDTO {

    private String planName;
    private String planSubtitle;
    private Double totalEstimatedCost;
    private Integer totalStops;
    private List<MasarStopDTO> stops;

    public MasarPlanDTO() {
    }

    public MasarPlanDTO(String planName, String planSubtitle, Double totalEstimatedCost,
                        Integer totalStops, List<MasarStopDTO> stops) {
        this.planName = planName;
        this.planSubtitle = planSubtitle;
        this.totalEstimatedCost = totalEstimatedCost;
        this.totalStops = totalStops;
        this.stops = stops;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanSubtitle() {
        return planSubtitle;
    }

    public void setPlanSubtitle(String planSubtitle) {
        this.planSubtitle = planSubtitle;
    }

    public Double getTotalEstimatedCost() {
        return totalEstimatedCost;
    }

    public void setTotalEstimatedCost(Double totalEstimatedCost) {
        this.totalEstimatedCost = totalEstimatedCost;
    }

    public Integer getTotalStops() {
        return totalStops;
    }

    public void setTotalStops(Integer totalStops) {
        this.totalStops = totalStops;
    }

    public List<MasarStopDTO> getStops() {
        return stops;
    }

    public void setStops(List<MasarStopDTO> stops) {
        this.stops = stops;
    }
}
