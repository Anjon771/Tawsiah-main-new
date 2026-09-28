package com.basira.tawsiah.ServiceImp;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Place;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Service.DataLoadService;
import com.fasterxml.jackson.databind.ObjectMapper;

// @Service
// public class DataLoadServiceImp implements DataLoadService {

//     private final PlaceRepository placeRepository;
//     private final EventRepository eventRepository;
//     private final ObjectMapper objectMapper;

//     public DataLoadServiceImp(PlaceRepository placeRepository, 
//                            EventRepository eventRepository,
//                            ObjectMapper objectMapper) {
//         this.placeRepository = placeRepository;
//         this.eventRepository = eventRepository;
//         this.objectMapper = objectMapper;
//     }

//     @Override
//     @Transactional
//     public void loadFromJsonFile(String filePath) throws IOException {
//         System.out.println("Starting data load from file:");
//         try (Stream<String> lines = Files.lines(Paths.get(filePath))) {
//             lines.forEach(line -> {
//                 if (line.trim().isEmpty()) return;
//                 try {
//                     var node = objectMapper.readTree(line);
//                     String type = node.get("type").asText();
//                     if ("PLACE".equalsIgnoreCase(type)) {
//                         Place place = objectMapper.treeToValue(node, Place.class);
//                         placeRepository.save(place);
//                     } else if ("EVENT".equalsIgnoreCase(type)) {
//                         Event event = objectMapper.treeToValue(node, Event.class);
//                         eventRepository.save(event);
//                     }
//                 } catch (Exception e) {
//                     System.err.println("Failed to parse line: " + e.getMessage());
//                 }
//             });
//         }
//     }
// }