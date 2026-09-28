package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.Request.RatingRequestDTO;
import com.basira.tawsiah.DTO.Response.RatingResponseDTO;

public interface RatingService {
    RatingResponseDTO addRating(RatingRequestDTO request);
    List<RatingResponseDTO> getRatingByEventId(Long eventId);
    List<RatingResponseDTO> getRatingsByUserId(Long userId);
    void deleteRating(Long id);
}
