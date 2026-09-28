package com.basira.tawsiah.ServiceImp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.Request.MasarRequestDTO;
import com.basira.tawsiah.DTO.Response.MasarDiscoveryDTO;
import com.basira.tawsiah.DTO.Response.MasarItineraryResponseDTO;
import com.basira.tawsiah.DTO.Response.MasarPlanDTO;
import com.basira.tawsiah.DTO.Response.MasarResponseDTO;
import com.basira.tawsiah.DTO.Response.MasarStopDTO;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Place;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Service.MasarService;

@Service
public class MasarServiceImp implements MasarService {

    private final PlaceRepository placeRepository;
    private final EventRepository eventRepository;

    public MasarServiceImp(PlaceRepository placeRepository, EventRepository eventRepository) {
        this.placeRepository = placeRepository;
        this.eventRepository = eventRepository;
    }

    // ========================= Discovery =========================

    @Override
    public MasarDiscoveryDTO getDiscovery() {
        List<String> categories = Stream.concat(
                placeRepository.findAllDistinctCategories().stream(),
                eventRepository.findAllDistinctCategories().stream()
        )
                .filter(c -> c != null && !c.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<String> cities = Stream.concat(
                placeRepository.findAllDistinctCities().stream(),
                eventRepository.findAllDistinctCities().stream()
        )
                .filter(c -> c != null && !c.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        return new MasarDiscoveryDTO(categories, cities);
    }

    // ========================= Itinerary (flat list) =========================

    @Override
    public MasarItineraryResponseDTO generateItinerary(MasarRequestDTO request) {
        Double budget = request.budget() != null && request.budget() > 0 ? request.budget() : 1000.0;

        List<String> interests = normalize(request.interests());
        List<String> cities = normalize(request.cities());

        final Double finalBudget = budget;

        // ---- Fetch matching places ----
        List<Place> matchingPlaces = placeRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && matchesAny(p.getCategory(), interests))
                .filter(p -> cities.isEmpty() || matchesAny(p.getCity(), cities))
                .filter(p -> p.getPrice() == null || p.getPrice() <= finalBudget)
                .sorted(Comparator.comparing(Place::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        // ---- Fetch matching events ----
        List<Event> matchingEvents = eventRepository.findAll().stream()
                .filter(e -> e.getCategory() != null && matchesAny(e.getCategory(), interests))
                .filter(e -> cities.isEmpty() || matchesAny(e.getCity(), cities))
                .filter(e -> parseEventPrice(e.getPrice()) <= finalBudget)
                .sorted(Comparator.comparing(Event::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        // ---- Build flat list of MasarStopDTO ----
        List<MasarStopDTO> items = new ArrayList<>();
        int stopNumber = 1;
        double totalCost = 0.0;

        for (Place p : matchingPlaces) {
            double price = p.getPrice() != null ? p.getPrice() : 0.0;
            totalCost += price;
            items.add(buildStopDTO(stopNumber++, p.getID(), p.getName(), p.getCity(),
                    p.getCategory(), p.getDescription(), price, p.getRate(),
                    p.getImageURL(), "place"));
        }
        for (Event e : matchingEvents) {
            double price = parseEventPrice(e.getPrice());
            totalCost += price;
            items.add(buildStopDTO(stopNumber++, e.getId(), e.getName(), e.getCity(),
                    e.getCategory(), e.getDescription(), price, e.getRate(),
                    e.getImageUrl(), "event"));
        }

        // Fallback if empty
        if (items.isEmpty()) {
            List<Place> fallback = placeRepository.findAll().stream()
                    .sorted(Comparator.comparing(Place::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(10)
                    .collect(Collectors.toList());
            for (Place p : fallback) {
                double price = p.getPrice() != null ? p.getPrice() : 0.0;
                totalCost += price;
                items.add(buildStopDTO(stopNumber++, p.getID(), p.getName(), p.getCity(),
                        p.getCategory(), p.getDescription(), price, p.getRate(),
                        p.getImageURL(), "place"));
            }
        }

        return new MasarItineraryResponseDTO(
                items,
                budget,
                items.size(),
                Math.round(totalCost * 100.0) / 100.0
        );
    }

    // ========================= Curated Plans (legacy) =========================

    @Override
    public MasarResponseDTO generatePlans(MasarRequestDTO request) {
        return generatePlans(null, request.budget(), request.interests());
    }

    @Override
    public MasarResponseDTO generatePlans(Long userId, Double budget, List<String> interests) {
        if (budget == null || budget <= 0) {
            budget = 1000.0;
        }

        List<String> normalizedInterests = normalize(interests);
        final List<String> finalInterests = normalizedInterests.isEmpty()
                ? List.of("nature", "historical", "beach")
                : normalizedInterests;

        final Double finalBudget = budget;

        List<Place> matchingPlaces = placeRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && matchesAny(p.getCategory(), finalInterests))
                .filter(p -> p.getPrice() == null || p.getPrice() <= finalBudget)
                .sorted(Comparator.comparing(Place::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        List<Event> matchingEvents = eventRepository.findAll().stream()
                .filter(e -> e.getCategory() != null && matchesAny(e.getCategory(), finalInterests))
                .filter(e -> parseEventPrice(e.getPrice()) <= finalBudget)
                .sorted(Comparator.comparing(Event::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        List<ScoredItem> pool = new ArrayList<>();
        for (Place p : matchingPlaces) {
            pool.add(new ScoredItem(p.getID(), p.getName(), p.getCity(), p.getCategory(),
                    p.getDescription(), p.getPrice() != null ? p.getPrice() : 0.0,
                    p.getRate(), p.getImageURL(), "place"));
        }
        for (Event e : matchingEvents) {
            double price = parseEventPrice(e.getPrice());
            pool.add(new ScoredItem(e.getId(), e.getName(), e.getCity(), e.getCategory(),
                    e.getDescription(), price,
                    e.getRate(), e.getImageUrl(), "event"));
        }

        if (pool.isEmpty()) {
            List<Place> fallback = placeRepository.findAll().stream()
                    .sorted(Comparator.comparing(Place::getRate, Comparator.nullsLast(Comparator.reverseOrder())))
                    .limit(6)
                    .collect(Collectors.toList());
            for (Place p : fallback) {
                pool.add(new ScoredItem(p.getID(), p.getName(), p.getCity(), p.getCategory(),
                        p.getDescription(), p.getPrice() != null ? p.getPrice() : 0.0,
                        p.getRate(), p.getImageURL(), "place"));
            }
        }

        List<MasarPlanDTO> plans = new ArrayList<>();

        List<ScoredItem> planAStops = buildGrandTour(pool, 6);
        if (!planAStops.isEmpty()) {
            plans.add(buildPlanDTO("The Grand Tour", "Top-rated picks across multiple cities", planAStops));
        }

        List<ScoredItem> planBStops = buildCityDeepDiveOrHiddenGems(pool, planAStops, 6);
        if (!planBStops.isEmpty()) {
            String subtitle = planBStops.stream().map(ScoredItem::city).distinct().count() == 1
                    ? "Immerse yourself in one incredible city"
                    : "Discover lesser-known treasures";
            plans.add(buildPlanDTO(
                    subtitle.startsWith("Immerse") ? "City Deep Dive" : "Hidden Gems",
                    subtitle, planBStops));
        }

        List<ScoredItem> planCStops = buildBestValue(pool, planAStops, planBStops, 6);
        if (!planCStops.isEmpty()) {
            plans.add(buildPlanDTO("Best Value", "Maximize experiences within your budget", planCStops));
        }

        return new MasarResponseDTO(plans);
    }

    // ========================= Helpers =========================

    private List<String> normalize(List<String> raw) {
        if (raw == null) return List.of();
        return raw.stream()
                .filter(i -> i != null && !i.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .collect(Collectors.toList());
    }

    private boolean matchesAny(String value, List<String> targets) {
        if (value == null) return false;
        String lower = value.toLowerCase();
        return targets.stream().anyMatch(lower::contains);
    }

    private double parseEventPrice(String price) {
        if (price == null) return 0.0;
        String cleaned = price.trim().toLowerCase().replace("$", "").replace("sar", "").replace(",", "").trim();
        if (cleaned.isEmpty() || cleaned.equals("free")) return 0.0;
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private MasarStopDTO buildStopDTO(int stopNumber, Long id, String name, String city,
                                       String category, String description, double price,
                                       Double rate, String imageUrl, String type) {
        return new MasarStopDTO(
                stopNumber,
                id,
                name,
                city,
                category,
                description != null ? description.substring(0, Math.min(120, description.length())) + "..." : "",
                price <= 0.0 ? "Free" : String.format("%.2f", price),
                rate,
                imageUrl,
                type
        );
    }

    private List<ScoredItem> buildGrandTour(List<ScoredItem> pool, int maxStops) {
        List<ScoredItem> result = new ArrayList<>();
        Set<String> usedCities = new HashSet<>();
        Set<Long> usedIds = new HashSet<>();

        for (ScoredItem item : pool) {
            if (result.size() >= maxStops) break;
            if (usedIds.contains(item.id())) continue;
            String city = item.city() != null ? item.city().toLowerCase() : "";
            if (usedCities.contains(city) && usedCities.size() >= 2) {
                continue;
            }
            usedCities.add(city);
            usedIds.add(item.id());
            result.add(item);
        }
        return result;
    }

    private List<ScoredItem> buildCityDeepDiveOrHiddenGems(List<ScoredItem> pool,
                                                               List<ScoredItem> excludeA, int maxStops) {
        Set<Long> excludedIds = excludeA.stream().map(ScoredItem::id).collect(Collectors.toSet());

        Map<String, List<ScoredItem>> byCity = pool.stream()
                .filter(i -> !excludedIds.contains(i.id()))
                .collect(Collectors.groupingBy(i -> i.city() != null ? i.city().toLowerCase() : "unknown"));

        for (Map.Entry<String, List<ScoredItem>> entry : byCity.entrySet()) {
            if (entry.getValue().size() >= 3) {
                return entry.getValue().stream().limit(maxStops).collect(Collectors.toList());
            }
        }

        return pool.stream()
                .filter(i -> !excludedIds.contains(i.id()))
                .sorted(Comparator.comparing(ScoredItem::rate, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(maxStops)
                .collect(Collectors.toList());
    }

    private List<ScoredItem> buildBestValue(List<ScoredItem> pool,
                                              List<ScoredItem> excludeA,
                                              List<ScoredItem> excludeB,
                                              int maxStops) {
        Set<Long> excludedIds = new HashSet<>();
        excludeA.forEach(i -> excludedIds.add(i.id()));
        excludeB.forEach(i -> excludedIds.add(i.id()));

        return pool.stream()
                .filter(i -> !excludedIds.contains(i.id()))
                .sorted(Comparator.comparingDouble(ScoredItem::price))
                .limit(maxStops)
                .collect(Collectors.toList());
    }

    private MasarPlanDTO buildPlanDTO(String name, String subtitle, List<ScoredItem> items) {
        List<MasarStopDTO> stops = new ArrayList<>();
        double totalCost = 0.0;

        for (int i = 0; i < items.size(); i++) {
            ScoredItem item = items.get(i);
            totalCost += item.price();
            stops.add(buildStopDTO(i + 1, item.id(), item.name(), item.city(),
                    item.category(), item.description(), item.price(),
                    item.rate(), item.imageUrl(), item.type()));
        }

        MasarPlanDTO plan = new MasarPlanDTO();
        plan.setPlanName(name);
        plan.setPlanSubtitle(subtitle);
        plan.setTotalEstimatedCost(Math.round(totalCost * 100.0) / 100.0);
        plan.setTotalStops(stops.size());
        plan.setStops(stops);
        return plan;
    }

    private record ScoredItem(Long id, String name, String city, String category,
                                String description, double price, Double rate,
                                String imageUrl, String type) {}
}
