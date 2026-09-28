package com.basira.tawsiah.ServiceImp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.basira.tawsiah.DTO.Request.RecommendationRequestDTO;
import com.basira.tawsiah.DTO.Response.EventSummaryDTO;
import com.basira.tawsiah.DTO.Response.RecommendationResponseDTO;
import com.basira.tawsiah.Exception.UserNotFoundException;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.interest;
import com.basira.tawsiah.Repository.InterestRepository;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Service.RecommendationService;
import com.basira.tawsiah.Mapper.EventMapper;
import com.basira.tawsiah.Model.Entities.Place;

@Service
public class RecommendationServiceImp implements RecommendationService {

    private final EventRepository eventRepository;
    private final PlaceRepository placeRepository;
    private final InterestRepository interestRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final EventMapper eventMapper;

    @Value("${python.recommendation.url:http://localhost:8000}")
    private String pythonUrl;

    /**
     * City proximity tiers for Saudi Arabia.
     * Maps a city to its neighbouring / adjacent cities.
     */
    private static final Map<String, List<String>> PROXIMITY_TIERS = Map.ofEntries(
        Map.entry("riyadh",    List.of("taif", "dammam", "khobar")),
        Map.entry("jeddah",    List.of("mecca", "taif", "medina")),
        Map.entry("mecca",     List.of("jeddah", "taif", "medina")),
        Map.entry("medina",    List.of("mecca", "jeddah", "tabuk", "yanbu")),
        Map.entry("dammam",    List.of("khobar", "riyadh")),
        Map.entry("khobar",    List.of("dammam", "riyadh")),
        Map.entry("abha",      List.of("taif", "jeddah")),
        Map.entry("taif",      List.of("mecca", "jeddah", "riyadh", "abha")),
        Map.entry("tabuk",     List.of("medina", "alula")),
        Map.entry("alula",     List.of("tabuk", "medina")),
        Map.entry("yanbu",     List.of("medina", "jeddah")),
        Map.entry("makkah",    List.of("jeddah", "taif", "medina")),
        Map.entry("ha'il",     List.of("riyadh", "tabuk")),
        Map.entry("hail",      List.of("riyadh", "tabuk"))
    );

    public RecommendationServiceImp(
            EventRepository eventRepository,
            PlaceRepository placeRepository,
            InterestRepository interestRepository,
            UserRepository userRepository,
            RestTemplate restTemplate,
            EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.placeRepository = placeRepository;
        this.interestRepository = interestRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.eventMapper = eventMapper;
    }

    @Override
    public List<Event> getPersonalizedEvents(Long userId, String city) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }

        List<String> userCategories = new ArrayList<>();
        List<String> userCities = new ArrayList<>();

        for (interest i : interestRepository.findByUsersId(userId)) {
            if ("city".equals(i.getType())) {
                userCities.add(i.getName());
            } else {
                userCategories.add(i.getName());
            }
        }

        RecommendationRequestDTO request = new RecommendationRequestDTO(userId, userCategories, userCities, city);

        try {
            Long[] eventIds = restTemplate.postForObject(
                pythonUrl + "/api/recommendation/{userId}",
                request,
                Long[].class,
                userId
            );

            if (eventIds != null && eventIds.length > 0) {
                System.err.println("returned eventIDs from fastAPI success!!!");
                return eventRepository.findAllById(Arrays.asList(eventIds));
            } else {
                System.err.println("returned eventIDs from direct database success!!!");
                return eventRepository.findTop10ByCityOrderByRateDesc(city);
            }
        } catch (Exception e) {
            System.err.println("AI service Error: " + e.getMessage());
            return eventRepository.findTop10ByCityOrderByRateDesc(city);
        }
    }

    @Override
    public RecommendationResponseDTO getRecommendations(RecommendationRequestDTO request) {
        // 1. Try the Python AI engine first
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("categories", request.categories());
            payload.put("cities", request.cities());
            payload.put("userId", request.userId());
            payload.put("limit", request.limit());
            payload.put("city", request.city());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                pythonUrl + "/recommend",
                entity,
                Map.class
            );

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> scoredItems = (List<Map<String, Object>>) response.getBody().get("scoredItems");
            String strategy = (String) response.getBody().get("strategy");

            if (scoredItems != null && !scoredItems.isEmpty()) {
                List<Long> eventIds = new ArrayList<>();
                List<Long> placeIds = new ArrayList<>();

                for (Map<String, Object> item : scoredItems) {
                    String type = (String) item.get("type");
                    Integer id = (Integer) item.get("id");
                    if (id == null) continue;
                    if ("event".equals(type)) {
                        eventIds.add(Long.valueOf(id));
                    } else {
                        placeIds.add(Long.valueOf(id));
                    }
                }

                List<Event> events = eventRepository.findAllById(eventIds);
                List<Place> places = placeRepository.findAllById(placeIds);

                Map<Long, EventSummaryDTO> eventDtoMap = new HashMap<>();
                Map<Long, EventSummaryDTO> placeDtoMap = new HashMap<>();

                for (Event event : events) {
                    EventSummaryDTO dto = eventMapper.toSummaryResponse(event);
                    dto.setType("event");
                    eventDtoMap.put(event.getId(), dto);
                }

                for (Place place : places) {
                    EventSummaryDTO dto = mapPlaceToSummary(place);
                    dto.setType("place");
                    placeDtoMap.put(place.getID(), dto);
                }

                List<EventSummaryDTO> ordered = new ArrayList<>();
                for (Map<String, Object> item : scoredItems) {
                    Integer id = (Integer) item.get("id");
                    String type = (String) item.get("type");
                    if (id == null) continue;
                    Long longId = Long.valueOf(id);
                    if ("event".equals(type) && eventDtoMap.containsKey(longId)) {
                        ordered.add(eventDtoMap.get(longId));
                    } else if (placeDtoMap.containsKey(longId)) {
                        ordered.add(placeDtoMap.get(longId));
                    }
                }

                RecommendationResponseDTO result = new RecommendationResponseDTO(ordered, strategy != null ? strategy : "top_rated_fallback");
                result.setScoredItems(ordered);
                return result;
            }
        } catch (ResourceAccessException e) {
            System.err.println("Python engine unavailable — using proximity fallback: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Recommendation engine error — using proximity fallback: " + e.getMessage());
        }

        // 2. Proximity-based fallback
        return getProximityBasedRecommendations(request);
    }

    /**
     * Proximity-based recommendation fallback.
     *
     * Logic:
     *   Tier 0 – Exact city match (highest priority)
     *   Tier 1 – Adjacent / nearby cities
     *   Tier 2 – All remaining cities that match the user's categories
     *
     * Results are then scored (category match + rate + proximity) and ranked.
     */
    private RecommendationResponseDTO getProximityBasedRecommendations(RecommendationRequestDTO request) {
        String targetCity = request.city() != null ? request.city().trim().toLowerCase() : null;
        List<String> categories = request.categories();
        int limit = request.limit() != null ? request.limit() : 10;
        String strategy = determineFallbackStrategy(categories, targetCity);

        if (targetCity == null || targetCity.isEmpty()) {
            // No city provided — global category-based fallback
            List<Event> allMatches = eventRepository.findAll().stream()
                .filter(e -> matchesCategory(e, categories))
                .sorted((a, b) -> Double.compare(
                    b.getRate() != null ? b.getRate() : 0.0,
                    a.getRate() != null ? a.getRate() : 0.0))
                .limit(limit)
                .collect(Collectors.toList());
            List<EventSummaryDTO> scored = scoreAndRank(allMatches, categories, null, limit);
            return new RecommendationResponseDTO(scored, strategy);
        }

        Set<Long> seen = new HashSet<>();
        List<Event> candidates = new ArrayList<>();

        // ---- Tier 0: user's exact city ----
        List<Event> tier0 = eventRepository.findAll().stream()
            .filter(e -> targetCity.equalsIgnoreCase(normalizeCity(e.getCity())))
            .filter(e -> matchesCategory(e, categories))
            .collect(Collectors.toList());
        candidates.addAll(tier0);
        tier0.forEach(e -> seen.add(e.getId()));

        // ---- Tier 1: nearby cities ----
        List<String> nearbyCities = PROXIMITY_TIERS.getOrDefault(targetCity, List.of());
        if (!nearbyCities.isEmpty()) {
            List<Event> tier1 = eventRepository.findAll().stream()
                .filter(e -> nearbyCities.stream()
                    .anyMatch(c -> c.equalsIgnoreCase(normalizeCity(e.getCity()))))
                .filter(e -> matchesCategory(e, categories))
                .filter(e -> !seen.contains(e.getId()))
                .collect(Collectors.toList());
            candidates.addAll(tier1);
            tier1.forEach(e -> seen.add(e.getId()));
        }

        // ---- Tier 2: remaining cities with matching category ----
        List<Event> tier2 = eventRepository.findAll().stream()
            .filter(e -> !seen.contains(e.getId()))
            .filter(e -> matchesCategory(e, categories))
            .collect(Collectors.toList());
        candidates.addAll(tier2);

        List<EventSummaryDTO> scored = scoreAndRank(candidates, categories, targetCity, limit);
        return new RecommendationResponseDTO(scored, strategy);
    }

    /**
     * Weighted scoring & ranking.
     *
     * Formula:
     *   categoryScore = 5.0 down to 1.0 based on preference rank
     *   rateScore     = event.rate (0–5)
     *   proximityScore = 5.0 same city, 3.0 nearby, 1.0 distant
     *
     *   combined = (categoryScore * 0.45) + (rateScore * 0.35) + (proximityScore * 0.20)
     *
     * relevanceScore = (combined / 5.0) * 100  (0–100 scale for frontend display)
     */
    private List<EventSummaryDTO> scoreAndRank(List<Event> events, List<String> categories, String targetCity, int limit) {
        Map<String, Double> categoryWeightMap = new HashMap<>();
        for (int i = 0; i < categories.size(); i++) {
            double score = Math.max(5.0 - (i * 0.5), 1.0);
            categoryWeightMap.put(categories.get(i).toLowerCase(), score);
        }

        List<String> nearbyCities = targetCity != null
            ? PROXIMITY_TIERS.getOrDefault(targetCity, List.of())
            : List.of();

        List<ScoredEvent> scored = events.stream()
            .map(event -> {
                double categoryScore = categoryWeightMap.getOrDefault(
                    event.getCategory() != null ? event.getCategory().toLowerCase() : "",
                    0.5
                );

                double rateScore = event.getRate() != null ? event.getRate() : 0.0;

                double proximityScore;
                String eventCity = normalizeCity(event.getCity());
                if (targetCity != null && targetCity.equals(eventCity)) {
                    proximityScore = 5.0;
                } else if (nearbyCities.stream().anyMatch(c -> c.equals(eventCity))) {
                    proximityScore = 3.0;
                } else {
                    proximityScore = 1.0;
                }

                double combined = (categoryScore * 0.45)
                                + (rateScore    * 0.35)
                                + (proximityScore * 0.20);

                int relevanceScore = (int) Math.round((combined / 5.0) * 100.0);

                return new ScoredEvent(event, combined, relevanceScore);
            })
            .sorted((a, b) -> Double.compare(b.combinedScore(), a.combinedScore()))
            .limit(limit)
            .collect(Collectors.toList());

        return scored.stream()
            .map(se -> {
                EventSummaryDTO dto = eventMapper.toSummaryResponse(se.event());
                dto.setRelevanceScore(se.relevanceScore());
                return dto;
            })
            .collect(Collectors.toList());
    }

    private boolean matchesCategory(Event event, List<String> categories) {
        if (event.getCategory() == null) return false;
        return categories.stream()
            .anyMatch(cat -> cat.equalsIgnoreCase(event.getCategory()));
    }

    /**
     * Normalise a city name for consistent comparison.
     * Removes diacritics and lower-cases the input.
     */
    private String normalizeCity(String city) {
        if (city == null) return "";
        return city.trim().toLowerCase()
            .replaceAll("[ً-ٟـ]", "")   // remove Arabic diacritics
            .replace("'", "")
            .replace("-", "");
    }

    /**
     * Map a Place entity to EventSummaryDTO so both types can be rendered
     * by the same frontend component (PlaceCard).
     */
    private EventSummaryDTO mapPlaceToSummary(Place place) {
        EventSummaryDTO dto = new EventSummaryDTO(
            place.getID(),
            place.getImageURL(),
            place.getName(),
            place.getDescription(),
            place.getCity(),
            place.getCategory(),
            place.getRate(),
            place.getPrice() != null ? String.valueOf(place.getPrice()) : "Free",
            place.getSchedule()
        );
        dto.setType("place");
        return dto;
    }

    @Override
    public void syncUserProfile(Long userId, List<String> interests, List<String> sessionCategories) {
        try {
            List<String> categoryInterests = new ArrayList<>();
            List<String> cityInterests = new ArrayList<>();

            for (String interestName : interests) {
                interestRepository.findByName(interestName).ifPresent(i -> {
                    if ("city".equals(i.getType())) {
                        cityInterests.add(interestName);
                    } else {
                        categoryInterests.add(interestName);
                    }
                });
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", userId);
            payload.put("interests", categoryInterests);
            payload.put("cities", cityInterests);
            payload.put("recentViews", List.of());
            payload.put("favorites", List.of());
            payload.put("sessionCategories", sessionCategories);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(pythonUrl + "/update-profile", entity, Map.class);
            System.out.println("Profile synced for user: " + userId);
        } catch (Exception e) {
            System.err.println("Profile sync failed (non-critical): " + e.getMessage());
        }
    }

    /**
     * Global category-based fallback (used when no city is available).
     */
    private List<EventSummaryDTO> getFallbackRecommendations(List<String> categories) {
        return eventRepository.findAll().stream()
            .filter(e -> e.getCategory() != null && categories.stream()
                .anyMatch(cat -> cat.equalsIgnoreCase(e.getCategory())))
            .sorted((a, b) -> Double.compare(
                b.getRate() != null ? b.getRate() : 0.0,
                a.getRate() != null ? a.getRate() : 0.0))
            .limit(10)
            .map(eventMapper::toSummaryResponse)
            .collect(Collectors.toList());
    }

    /**
     * Determine the fallback strategy label based on available signals.
     */
    private String determineFallbackStrategy(List<String> categories, String city) {
        boolean hasCategories = categories != null && !categories.isEmpty();
        boolean hasCity = city != null && !city.isEmpty();
        if (hasCategories && hasCity) return "hybrid_city_category";
        if (hasCity) return "city_based";
        if (hasCategories) return "category_based";
        return "top_rated_fallback";
    }

    private record ScoredEvent(Event event, double combinedScore, int relevanceScore) {}
}
