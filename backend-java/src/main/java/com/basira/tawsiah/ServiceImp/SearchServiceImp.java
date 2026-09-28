package com.basira.tawsiah.ServiceImp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;
import com.basira.tawsiah.DTO.SearchResultDTO;
import com.basira.tawsiah.Mapper.EventMapper;
import com.basira.tawsiah.Mapper.PlaceMapper;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Place;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Service.SearchService;

@Service
public class SearchServiceImp implements SearchService {

      
    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PlaceMapper placeMapper;

    @Autowired
    private EventMapper eventMapper;

    @Override
    public SearchResultDTO globalSearch(String query) {
        // 1. Look for places matching the query (using the repository method)
        List<Place> places = placeRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrCategoryIgnoreCase(
                query, query, query
        );

        // 2. search for events matching the query (using the repository method)
        List<Event> events = eventRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query
        );

        // 3. convert the Place entities to PlaceSummaryResponseDTOs using the mapper
        List<PlaceSummaryResponseDTO> placeDtos = places.stream()
                .map(placeMapper::toSummaryResponse)
                .collect(Collectors.toList());

        // 4. convert the Event entities to EventSummaryDTOs using the mapper
        List<EventSummaryDTO> eventDtos = events.stream()
                .map(eventMapper::toSummaryResponse)
                .collect(Collectors.toList());

        // 5. put the placeDtos and events into a SearchResultDTO and return it
        return new SearchResultDTO(placeDtos, eventDtos);
    }
    
}
