package com.basira.tawsiah.ServiceImp;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.Request.EventRequestDTO;
import com.basira.tawsiah.DTO.Response.EventDetailedResponseDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Update.EventUpdateDTO;
import com.basira.tawsiah.Exception.EventNotFoundException;
import com.basira.tawsiah.Mapper.EventMapper;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.EventSpecification;
import com.basira.tawsiah.Service.EventService;


@Service
public class EventServiceImp implements EventService {

    private final EventRepository repo;
    private final EventMapper mapper;
    private final RedisSyncService redisSyncService;


    public EventServiceImp(EventRepository repo, EventMapper mapper, RedisSyncService redisSyncService) {
        this.repo = repo;
        this.mapper = mapper;
        this.redisSyncService = redisSyncService;
    }
    

    @Override
    public EventDetailedResponseDTO createEvent(EventRequestDTO request) {

        Event event = mapper.toEntity(request);
        Event saved = repo.save(event);

        redisSyncService.queueEventForAi(mapper.toDetailedResponse(saved));
        return mapper.toDetailedResponse(saved);
        
    }

    @Override
    public EventDetailedResponseDTO getByID(Long id) {

        Event event = repo.findById(id).orElseThrow(()->new EventNotFoundException(id));
        return mapper.toDetailedResponse(event);
         
    }

    @Override
    public List<EventSummaryDTO> getAllEvents() {

        List<Event> events = repo.findAll();
        List<EventSummaryDTO> responseList = new ArrayList<>();

        for(Event event : events){
            EventSummaryDTO summary = mapper.toSummaryResponse(event);
            responseList.add(summary);
        }
        return responseList;
        
    }

    @Override
    public EventDetailedResponseDTO deleteEventByID(Long id) {
        Event event = repo.findById(id).orElseThrow(()-> new EventNotFoundException(id));

        repo.deleteById(id);

        redisSyncService.queueEventForAi("DELETE_EVENT:" + id);

        EventDetailedResponseDTO response = mapper.toDetailedResponse(event);
        return response;
    }

    @Override
    public EventDetailedResponseDTO updateEvent(Long id, EventUpdateDTO update) {
        Event existingEvent = repo.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));

        existingEvent.setName(update.getName());
        existingEvent.setDescription(update.getDescription());
        existingEvent.setCategory(update.getCategory());
        existingEvent.setCity(update.getCity());
        existingEvent.setPrice(String.valueOf(update.getPrice()));
        existingEvent.setImageUrl(update.getImageUrl());
        existingEvent.setLocation(update.getLocation());
        existingEvent.setSchedule(update.getSchedule());

        Event updatedEvent = repo.save(existingEvent);

        redisSyncService.queueEventForAi(mapper.toDetailedResponse(updatedEvent));

        return mapper.toDetailedResponse(updatedEvent);
    }

    @Override
    public List<EventSummaryDTO> filterEvents(
        String category, String city, Double minRating, String search
    ) {
        Specification<Event> spec = EventSpecification.buildSpec(
            category, city, minRating, search
        );

        List<Event> events = repo.findAll(spec);

        return events.stream()
            .map(mapper::toSummaryResponse)
            .collect(Collectors.toList());
    }

}
