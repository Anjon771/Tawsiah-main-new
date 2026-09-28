package com.basira.tawsiah.Mapper;

import org.mapstruct.Mapper;

import com.basira.tawsiah.DTO.Request.EventRequestDTO;
import com.basira.tawsiah.DTO.Response.EventDetailedResponseDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Update.EventUpdateDTO;
import com.basira.tawsiah.Model.Entities.Event;

@Mapper(componentModel = "spring")
public interface EventMapper {
    
    Event toEntity(EventRequestDTO request);
    Event toEntityFromUpdate(EventUpdateDTO update);
    EventDetailedResponseDTO toDetailedResponse(Event event);
    EventSummaryDTO toSummaryResponse(Event event);
    
}
