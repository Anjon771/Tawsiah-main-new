package com.basira.tawsiah.Mapper;


import com.basira.tawsiah.DTO.Request.RatingRequestDTO;
import com.basira.tawsiah.DTO.Response.RatingResponseDTO;
import com.basira.tawsiah.Model.Entities.Rating;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RatingMapper {

    /**
     * Converts Entity to Response DTO.
     * We must map the Event object's ID to the Long eventId field.
     */
    @Mapping(source = "event.id", target = "eventID")
    @Mapping(target = "eventName", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "date", ignore = true)
    RatingResponseDTO toResponseDTO(Rating rating);

    @AfterMapping
    default void enrichRatingResponse(Rating rating, @MappingTarget RatingResponseDTO dto) {
        if (rating.getEvent() != null) {
            dto.setEventName(rating.getEvent().getName());
            dto.setImageUrl(rating.getEvent().getImageUrl());
        }
        if (rating.getRatingDate() != null) {
            dto.setDate(rating.getRatingDate().toString());
        }
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "user", ignore = true)
    Rating toEntity(RatingRequestDTO request);
}