package com.basira.tawsiah.Mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.basira.tawsiah.DTO.MapPointDTO;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Place;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    @Mapping(target = "id", source = "ID")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "isEvent", constant = "false")
    @Mapping(target = "location.latitude", source = "location.latitude")
    @Mapping(target = "location.longitude", source = "location.longitude")
    @Mapping(target = "categories", expression = "java(java.util.List.of(place.getCategory()))")
    @Mapping(target = "rating", source = "rate")
    @Mapping(target = "rate", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "date", ignore = true)
    MapPointDTO toMapPoint(Place place);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "isEvent", constant = "true")
    @Mapping(target = "location.latitude", source = "location.latitude")
    @Mapping(target = "location.longitude", source = "location.longitude")
    @Mapping(target = "categories", expression = "java(java.util.List.of(event.getCategory()))")
    @Mapping(target = "rating", source = "rate")
    @Mapping(target = "rate", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "date", ignore = true)
    MapPointDTO toMapPoint(Event event);

    @AfterMapping
    default void enrichPlaceMapPoint(Place place, @MappingTarget MapPointDTO dto) {
        dto.setRate(place.getRate());
        dto.setImageUrl(place.getImageURL());
        dto.setCity(place.getCity());
        if (place.getPrice() != null) {
            dto.setPrice(String.valueOf(place.getPrice()));
        }
        if (place.getSchedule() != null) {
            dto.setDate(place.getSchedule().getDate());
        }
    }

    @AfterMapping
    default void enrichEventMapPoint(Event event, @MappingTarget MapPointDTO dto) {
        dto.setRate(event.getRate());
        dto.setImageUrl(event.getImageUrl());
        dto.setCity(event.getCity());
        dto.setPrice(event.getPrice());
        if (event.getSchedule() != null) {
            dto.setDate(event.getSchedule().getDate());
        }
    }
}
