package com.basira.tawsiah.DTO.Request;

import java.util.List;

public record MasarRequestDTO(
    Double budget,
    List<String> interests,
    List<String> cities
) {
    public MasarRequestDTO {
        if (budget == null) {
            budget = 1000.0;
        }
        if (interests == null) {
            interests = List.of();
        }
        if (cities == null) {
            cities = List.of();
        }
    }
}
