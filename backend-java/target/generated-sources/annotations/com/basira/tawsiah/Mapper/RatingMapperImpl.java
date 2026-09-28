package com.basira.tawsiah.Mapper;

import com.basira.tawsiah.DTO.Request.RatingRequestDTO;
import com.basira.tawsiah.DTO.Response.RatingResponseDTO;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Rating;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-28T21:55:53+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class RatingMapperImpl implements RatingMapper {

    @Override
    public RatingResponseDTO toResponseDTO(Rating rating) {
        if ( rating == null ) {
            return null;
        }

        RatingResponseDTO ratingResponseDTO = new RatingResponseDTO();

        ratingResponseDTO.setEventID( ratingEventId( rating ) );
        ratingResponseDTO.setId( rating.getId() );
        ratingResponseDTO.setRating( rating.getRating() );
        ratingResponseDTO.setComment( rating.getComment() );
        ratingResponseDTO.setUserName( rating.getUserName() );

        enrichRatingResponse( rating, ratingResponseDTO );

        return ratingResponseDTO;
    }

    @Override
    public Rating toEntity(RatingRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Rating rating = new Rating();

        rating.setRating( request.getRating() );
        rating.setComment( request.getComment() );
        rating.setUserName( request.getUserName() );

        return rating;
    }

    private Long ratingEventId(Rating rating) {
        if ( rating == null ) {
            return null;
        }
        Event event = rating.getEvent();
        if ( event == null ) {
            return null;
        }
        Long id = event.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
