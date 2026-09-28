package com.basira.tawsiah.ServiceImp;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.MapPointDTO;
import com.basira.tawsiah.Mapper.LocationMapper;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Service.MapService;

@Service
public class MapServiceImp implements MapService {

    @Autowired
    private final PlaceRepository placeRepository;

    @Autowired
    private final LocationMapper locationMapper;

    @Autowired
    private final EventRepository eventRepository;

    public MapServiceImp(PlaceRepository placeRepository, LocationMapper locationMapper, EventRepository eventRepository) {
        this.placeRepository = placeRepository;
        this.locationMapper = locationMapper;
        this.eventRepository = eventRepository;
    }

    @Override
    public List<MapPointDTO> getMapPoints() {
        // 1. Fetch all places and convert to MapPointDTOs
        List<MapPointDTO> places = placeRepository.findAll().stream()
                .map(locationMapper::toMapPoint)
                .collect(Collectors.toList());

       // 2. Fetch all events and convert to MapPointDTOs
        List<MapPointDTO> events = eventRepository.findAll().stream()
                .map(locationMapper::toMapPoint)
                .collect(Collectors.toList());

        // 3. Combine the two lists and return
        return Stream.concat(places.stream(), events.stream())
                .collect(Collectors.toList());
    }
    
}
