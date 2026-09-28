package com.basira.tawsiah.Mapper;

import com.basira.tawsiah.DTO.Request.EventRequestDTO;
import com.basira.tawsiah.DTO.Response.EventDetailedResponseDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Update.EventUpdateDTO;
import com.basira.tawsiah.Model.Entities.Event;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-28T21:55:53+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class EventMapperImpl implements EventMapper {

    @Override
    public Event toEntity(EventRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Event event = new Event();

        event.setName( request.getName() );
        event.setCategory( request.getCategory() );
        event.setDescription( request.getDescription() );
        event.setCity( request.getCity() );
        if ( request.getPrice() != null ) {
            event.setPrice( String.valueOf( request.getPrice() ) );
        }
        event.setImageUrl( request.getImageUrl() );
        event.setRate( request.getRate() );
        event.setLocation( request.getLocation() );
        event.setSchedule( request.getSchedule() );

        return event;
    }

    @Override
    public Event toEntityFromUpdate(EventUpdateDTO update) {
        if ( update == null ) {
            return null;
        }

        Event event = new Event();

        event.setName( update.getName() );
        event.setCategory( update.getCategory() );
        event.setDescription( update.getDescription() );
        event.setCity( update.getCity() );
        if ( update.getPrice() != null ) {
            event.setPrice( String.valueOf( update.getPrice() ) );
        }
        event.setImageUrl( update.getImageUrl() );
        event.setLocation( update.getLocation() );
        event.setSchedule( update.getSchedule() );

        return event;
    }

    @Override
    public EventDetailedResponseDTO toDetailedResponse(Event event) {
        if ( event == null ) {
            return null;
        }

        EventDetailedResponseDTO eventDetailedResponseDTO = new EventDetailedResponseDTO();

        eventDetailedResponseDTO.setType( event.getType() );
        eventDetailedResponseDTO.setId( event.getId() );
        eventDetailedResponseDTO.setImageUrl( event.getImageUrl() );
        eventDetailedResponseDTO.setName( event.getName() );
        eventDetailedResponseDTO.setDescription( event.getDescription() );
        eventDetailedResponseDTO.setCity( event.getCity() );
        eventDetailedResponseDTO.setRate( event.getRate() );
        eventDetailedResponseDTO.setPrice( event.getPrice() );
        eventDetailedResponseDTO.setSchedule( event.getSchedule() );
        eventDetailedResponseDTO.setCategory( event.getCategory() );
        eventDetailedResponseDTO.setLocation( event.getLocation() );

        return eventDetailedResponseDTO;
    }

    @Override
    public EventSummaryDTO toSummaryResponse(Event event) {
        if ( event == null ) {
            return null;
        }

        EventSummaryDTO eventSummaryDTO = new EventSummaryDTO();

        eventSummaryDTO.setId( event.getId() );
        eventSummaryDTO.setImageUrl( event.getImageUrl() );
        eventSummaryDTO.setName( event.getName() );
        eventSummaryDTO.setDescription( event.getDescription() );
        eventSummaryDTO.setCity( event.getCity() );
        eventSummaryDTO.setCategory( event.getCategory() );
        eventSummaryDTO.setRate( event.getRate() );
        eventSummaryDTO.setPrice( event.getPrice() );
        eventSummaryDTO.setSchedule( event.getSchedule() );
        eventSummaryDTO.setType( event.getType() );

        return eventSummaryDTO;
    }
}
