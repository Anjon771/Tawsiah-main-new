package com.basira.tawsiah.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.Request.RecommendationRequestDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Response.RecommendationResponseDTO;
import com.basira.tawsiah.Helper.CookieUtils;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Service.RecommendationService;
import com.basira.tawsiah.ServiceImp.GeocodingService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    private GeocodingService geocodingService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Get personalized events for a specific user.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Event>> getRecommendations(@PathVariable Long userId, @RequestParam String city) {
        List<Event> recommendations = recommendationService.getPersonalizedEvents(userId, city);
        if (recommendations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(recommendations);
    }

    /**
     * POST /api/recommendations — accepts RecommendationRequestDTO from frontend,
     * returns recommended events via Python engine with fallback.
     */
    @PostMapping
    public ResponseEntity<RecommendationResponseDTO> getRecommendationsByCategories(@RequestBody RecommendationRequestDTO request) {
        RecommendationResponseDTO recommendations = recommendationService.getRecommendations(request);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * POST /api/recommendations/sync — sync user profile to Python engine.
     */
    @PostMapping("/sync")
    @SuppressWarnings("unchecked")
    public ResponseEntity<Void> syncProfile(@RequestBody java.util.Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        List<String> interests = (List<String>) request.getOrDefault("interests", java.util.Collections.emptyList());
        List<String> sessionCategories = (List<String>) request.getOrDefault("sessionCategories", java.util.Collections.emptyList());
        recommendationService.syncUserProfile(userId, interests, sessionCategories);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}")
    public ResponseEntity<List<Event>> getRecommendations(
            @PathVariable Long userId,
            @RequestParam(required = false) String city,
            @RequestBody(required = false) Location userLocation,
            HttpServletRequest request,
            HttpServletResponse response) {

        String targetCity;
        String status;

        // Step 1: URL Priority
        if (city != null && !city.isEmpty()) {
            targetCity = city.toLowerCase();
            CookieUtils.setCityCookie(response, targetCity);
            status = "URL";
        }
        // Step 2: Cookie Memory
        else if (CookieUtils.getCityFromCookie(request) != null) {
            targetCity = CookieUtils.getCityFromCookie(request);
            status = "COOKIE";
        }
        // Step 3: GPS (Nominatim Handshake)
        else if (userLocation != null && userLocation.getLatitude() != null) {
            String[] bilingual = geocodingService.getBilingualCity(
                userLocation.getLatitude(),
                userLocation.getLongitude()
            );
            targetCity = bilingual[0]; // The English version
            CookieUtils.setCityCookie(response, targetCity);
            status = "GPS";
        }
        // Step 4: Hard Default
        else {
            targetCity = "makkah";
            status = "DEFAULT";
        }

        System.out.println("Location Resolved: " + targetCity + " via " + status);

        List<Event> recommendations = recommendationService.getPersonalizedEvents(userId, targetCity);
        if (recommendations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(recommendations);
    }
}
