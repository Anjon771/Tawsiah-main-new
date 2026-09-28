package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.Request.RecommendationRequestDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Response.RecommendationResponseDTO;
import com.basira.tawsiah.Model.Entities.Event;

public interface RecommendationService {

    public List<Event> getPersonalizedEvents(Long userId, String city);

    RecommendationResponseDTO getRecommendations(RecommendationRequestDTO request);

    void syncUserProfile(Long userId, List<String> interests, List<String> sessionCategories);

}
