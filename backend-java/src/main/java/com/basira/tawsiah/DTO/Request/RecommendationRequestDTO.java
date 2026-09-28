package com.basira.tawsiah.DTO.Request;

import java.util.List;

import java.util.ArrayList;

public record RecommendationRequestDTO(
    Long userId,
    List<String> categories,
    List<String> cities,
    String city,
    Integer limit
) {
    public RecommendationRequestDTO {
        if (limit == null) {
            limit = 10;
        }
        if (cities == null) {
            cities = new ArrayList<>();
        }
    }

    public RecommendationRequestDTO(Long userId, List<String> categories, String city) {
        this(userId, categories, new ArrayList<>(), city, 10);
    }

    public RecommendationRequestDTO(Long userId, List<String> categories, List<String> cities, String city) {
        this(userId, categories, cities, city, 10);
    }
}
