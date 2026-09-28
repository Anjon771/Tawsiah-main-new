package com.basira.tawsiah.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.Request.MasarRequestDTO;
import com.basira.tawsiah.DTO.Response.MasarDiscoveryDTO;
import com.basira.tawsiah.DTO.Response.MasarItineraryResponseDTO;
import com.basira.tawsiah.DTO.Response.MasarResponseDTO;
import com.basira.tawsiah.Service.MasarService;

@RestController
@RequestMapping("/api/v1/masar")
@CrossOrigin(origins = "*")
public class MasarController {

    private final MasarService masarService;

    public MasarController(MasarService masarService) {
        this.masarService = masarService;
    }

    /**
     * GET /api/v1/masar/discovery
     * Returns all unique categories and cities from places and events.
     */
    @GetMapping("/discovery")
    public ResponseEntity<MasarDiscoveryDTO> discovery() {
        MasarDiscoveryDTO response = masarService.getDiscovery();
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/masar/itinerary
     * Accepts budget, interests (categories), and cities.
     * Returns a flat list of ALL matching events/places.
     */
    @PostMapping("/itinerary")
    public ResponseEntity<MasarItineraryResponseDTO> itinerary(@RequestBody MasarRequestDTO request) {
        MasarItineraryResponseDTO response = masarService.generateItinerary(request);
        if (response.getItems() == null || response.getItems().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/masar/generate
     * Accepts budget and interests, returns 2–3 curated trip plans.
     */
    @PostMapping("/generate")
    public ResponseEntity<MasarResponseDTO> generate(@RequestBody MasarRequestDTO request) {
        MasarResponseDTO response = masarService.generatePlans(request);
        if (response.getPlans() == null || response.getPlans().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }
}
