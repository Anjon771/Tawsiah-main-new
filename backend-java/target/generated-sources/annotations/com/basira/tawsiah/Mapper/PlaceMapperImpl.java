package com.basira.tawsiah.Mapper;

import com.basira.tawsiah.DTO.Request.PlaceRequest;
import com.basira.tawsiah.DTO.Response.PlaceDetailResponseDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;
import com.basira.tawsiah.DTO.Update.PlaceUpdateDTO;
import com.basira.tawsiah.Model.Entities.Place;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-28T21:55:53+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class PlaceMapperImpl implements PlaceMapper {

    @Override
    public Place toEntity(PlaceRequest request) {
        if ( request == null ) {
            return null;
        }

        Place place = new Place();

        place.setName( request.getName() );
        place.setDescription( request.getDescription() );
        place.setCategory( request.getCategory() );
        place.setLocation( request.getLocation() );
        place.setSchedule( request.getSchedule() );
        place.setImageURL( request.getImageURL() );
        place.setCity( request.getCity() );
        place.setRate( request.getRate() );

        return place;
    }

    @Override
    public Place toEntityFromUpdate(PlaceUpdateDTO request) {
        if ( request == null ) {
            return null;
        }

        Place place = new Place();

        place.setName( request.getName() );
        place.setDescription( request.getDescription() );
        place.setCategory( request.getCategory() );
        place.setLocation( request.getLocation() );
        place.setSchedule( request.getSchedule() );
        place.setImageURL( request.getImageURL() );
        place.setCity( request.getCity() );

        return place;
    }

    @Override
    public PlaceSummaryResponseDTO toSummaryResponse(Place place) {
        if ( place == null ) {
            return null;
        }

        PlaceSummaryResponseDTO placeSummaryResponseDTO = new PlaceSummaryResponseDTO();

        placeSummaryResponseDTO.setId( place.getID() );
        placeSummaryResponseDTO.setSchedule( place.getSchedule() );
        placeSummaryResponseDTO.setName( place.getName() );
        placeSummaryResponseDTO.setDescription( place.getDescription() );
        placeSummaryResponseDTO.setCity( place.getCity() );
        placeSummaryResponseDTO.setImageURL( place.getImageURL() );
        placeSummaryResponseDTO.setCategory( place.getCategory() );
        placeSummaryResponseDTO.setRate( place.getRate() );

        return placeSummaryResponseDTO;
    }

    @Override
    public PlaceDetailResponseDTO toDetailResponse(Place place) {
        if ( place == null ) {
            return null;
        }

        PlaceDetailResponseDTO placeDetailResponseDTO = new PlaceDetailResponseDTO();

        placeDetailResponseDTO.setId( place.getID() );
        placeDetailResponseDTO.setType( place.getType() );
        placeDetailResponseDTO.setSchedule( place.getSchedule() );
        placeDetailResponseDTO.setLocation( place.getLocation() );
        placeDetailResponseDTO.setName( place.getName() );
        placeDetailResponseDTO.setDescription( place.getDescription() );
        placeDetailResponseDTO.setCity( place.getCity() );
        placeDetailResponseDTO.setCategory( place.getCategory() );
        placeDetailResponseDTO.setImageURL( place.getImageURL() );
        placeDetailResponseDTO.setRate( place.getRate() );

        return placeDetailResponseDTO;
    }
}
