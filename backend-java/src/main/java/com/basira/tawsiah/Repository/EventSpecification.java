package com.basira.tawsiah.Repository;

import org.springframework.data.jpa.domain.Specification;

import com.basira.tawsiah.Model.Entities.Event;

public class EventSpecification {

    public static Specification<Event> hasCategory(String category) {
        return (root, query, cb) ->
            category == null || category.isEmpty()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Event> hasCity(String city) {
        return (root, query, cb) ->
            city == null || city.isEmpty()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%");
    }

    public static Specification<Event> hasMinRating(Double minRating) {
        return (root, query, cb) ->
            minRating == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("rate"), minRating);
    }

    public static Specification<Event> hasSearch(String search) {
        return (root, query, cb) -> {
            if (search == null || search.trim().isEmpty()) return cb.conjunction();
            String pattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("city")), pattern),
                cb.like(cb.lower(root.get("category")), pattern)
            );
        };
    }

    public static Specification<Event> buildSpec(
        String category, String city,
        Double minRating, String search
    ) {
        return Specification
            .where(hasCategory(category))
            .and(hasCity(city))
            .and(hasMinRating(minRating))
            .and(hasSearch(search));
    }
}
