package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.Request.EventRequestDTO;
import com.basira.tawsiah.DTO.Response.EventDetailedResponseDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Update.EventUpdateDTO;

public interface EventService {
    
    EventDetailedResponseDTO createEvent (EventRequestDTO request);
    EventDetailedResponseDTO getByID(Long id);
    List<EventSummaryDTO> getAllEvents();
    EventDetailedResponseDTO deleteEventByID(Long id);
    EventDetailedResponseDTO updateEvent(Long id, EventUpdateDTO update);

    List<EventSummaryDTO> filterEvents(
        String category, String city, Double minRating, String search
    );
}
