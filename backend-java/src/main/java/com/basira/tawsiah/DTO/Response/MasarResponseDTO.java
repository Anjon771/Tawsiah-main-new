package com.basira.tawsiah.DTO.Response;

import java.util.List;

import lombok.Data;

@Data
public class MasarResponseDTO {

    private List<MasarPlanDTO> plans;

    public MasarResponseDTO() {
    }

    public MasarResponseDTO(List<MasarPlanDTO> plans) {
        this.plans = plans;
    }

    public List<MasarPlanDTO> getPlans() {
        return plans;
    }

    public void setPlans(List<MasarPlanDTO> plans) {
        this.plans = plans;
    }
}
