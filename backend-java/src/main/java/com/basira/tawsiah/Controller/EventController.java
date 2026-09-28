package com.basira.tawsiah.Controller;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.Request.EventRequestDTO;
import com.basira.tawsiah.DTO.Response.EventDetailedResponseDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Update.EventUpdateDTO;
import com.basira.tawsiah.Service.EventService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Event Controller", description = "basic CRUD operations for Event API")
@RestController
@RequestMapping("/event")
public class EventController {

    private EventService eventService;

    public EventController(EventService eventService){
        this.eventService=eventService;
    }
    
    @Operation(summary = "Get all Event", description = "Returns a summary list of all Event")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping
    public ResponseEntity<List<EventSummaryDTO>> getAllPlaces(){
        
        List<EventSummaryDTO> responseList = eventService.getAllEvents();
        return new ResponseEntity<>(responseList , HttpStatus.OK);
        
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDetailedResponseDTO> getById(@Parameter(description = "ID of event to get") @PathVariable Long id){
        
        EventDetailedResponseDTO response = eventService.getByID(id);
        return new ResponseEntity<>(response , HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<EventDetailedResponseDTO> createEvent(@Valid @RequestBody EventRequestDTO request){
       
        try{
            
        EventDetailedResponseDTO response = eventService.createEvent(request);
        return new ResponseEntity<>(response , HttpStatus.CREATED);

        } catch (DataIntegrityViolationException e){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDetailedResponseDTO> updateEvent(
        @Parameter(description = "ID of event to update") @PathVariable Long id,
        @Valid @RequestBody EventUpdateDTO update)    
    {
        EventDetailedResponseDTO reponse = eventService.updateEvent(id, update);
        return new ResponseEntity<>(reponse , HttpStatus.OK);
        
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EventDetailedResponseDTO> deleteById(@PathVariable Long id){

        EventDetailedResponseDTO reponse = eventService.deleteEventByID(id);
        return new ResponseEntity<>(reponse,HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Filter events", description = "Returns filtered events based on query parameters")
    @ApiResponse(responseCode = "200", description = "Filtered list retrieved successfully")
    @GetMapping("/filter")
    public ResponseEntity<List<EventSummaryDTO>> filterEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String search) {

        List<EventSummaryDTO> results = eventService.filterEvents(
            category, city, minRating, search
        );
        return ResponseEntity.ok(results);
    }
}
