package com.basira.tawsiah.Controller;

import com.basira.tawsiah.DTO.Request.RatingRequestDTO;
import com.basira.tawsiah.DTO.Response.RatingResponseDTO;
import com.basira.tawsiah.Service.RatingService;

import jakarta.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    private final RatingService ratingService;

    // Constructor Injection
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    /**
     * Endpoint to add a new rating to an event.
     * Path: POST http://localhost:8080/api/ratings
     */
    @PostMapping
    public ResponseEntity<RatingResponseDTO> addRating(@Valid @RequestBody RatingRequestDTO request) {
       
       try{
        RatingResponseDTO response = ratingService.addRating(request);
        // Returning 201 Created is the professional standard for new data
        return new ResponseEntity<>(response, HttpStatus.CREATED);

       } catch (DataIntegrityViolationException e){
        
        return new ResponseEntity<>(HttpStatus.CONFLICT);
       }
    }

    /**
     * Endpoint to get all individual ratings for a specific event.
     * Path: GET http://localhost:8080/api/ratings/event/{eventId}
     */
    @GetMapping("/{eventId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByEvent(@PathVariable Long eventId) {
        List<RatingResponseDTO> response = ratingService.getRatingByEventId(eventId);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to get all ratings written by a specific user.
     * Path: GET http://localhost:8080/api/ratings/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByUser(@PathVariable Long userId) {
        List<RatingResponseDTO> response = ratingService.getRatingsByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ratingService.deleteRating(id);
        return ResponseEntity.noContent().build();
    }

}