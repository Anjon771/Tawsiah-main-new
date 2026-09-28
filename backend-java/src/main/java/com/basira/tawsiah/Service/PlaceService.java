package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.Request.PlaceRequest;
import com.basira.tawsiah.DTO.Response.PlaceDetailResponseDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;
import com.basira.tawsiah.DTO.Update.PlaceUpdateDTO;

public interface PlaceService {


    PlaceDetailResponseDTO createPlace(PlaceRequest request);
    PlaceDetailResponseDTO getPlaceById(Long id);
    List<PlaceSummaryResponseDTO> getAllPlaces();
    PlaceDetailResponseDTO updatePlace(Long id, PlaceUpdateDTO request);
    void deletePlace(Long id);

    List<PlaceSummaryResponseDTO> filterPlaces(
        String category, String city, Double minRating,
        String priceType, String search,
        String sortBy, String sortDir
    );
}
