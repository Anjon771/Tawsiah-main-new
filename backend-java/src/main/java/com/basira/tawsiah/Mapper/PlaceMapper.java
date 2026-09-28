package com.basira.tawsiah.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.basira.tawsiah.DTO.Request.PlaceRequest;
import com.basira.tawsiah.DTO.Response.PlaceDetailResponseDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;
import com.basira.tawsiah.DTO.Update.PlaceUpdateDTO;
import com.basira.tawsiah.Model.Entities.Place;

@Mapper(componentModel = "spring")
public interface PlaceMapper {
    
   
    Place toEntity (PlaceRequest request);


    Place toEntityFromUpdate(PlaceUpdateDTO request);


   
    @Mapping(source = "ID", target = "id")
    PlaceSummaryResponseDTO toSummaryResponse(Place place);

    
   
    @Mapping(source = "ID", target = "id")
    PlaceDetailResponseDTO toDetailResponse(Place place);
}
