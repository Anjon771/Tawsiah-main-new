package com.basira.tawsiah.Repository;

import org.springframework.data.jpa.domain.Specification;

import com.basira.tawsiah.Model.Entities.Place;

public class PlaceSpecification {

    public static Specification<Place> hasCategory(String category) {
        return (root, query, cb) ->
            category == null || category.isEmpty()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Place> hasCity(String city) {
        return (root, query, cb) ->
            city == null || city.isEmpty()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%");
    }

    public static Specification<Place> hasMinRating(Double minRating) {
        return (root, query, cb) ->
            minRating == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("rate"), minRating);
    }

    public static Specification<Place> hasPriceType(String priceType) {
        return (root, query, cb) -> {
            if (priceType == null || priceType.isEmpty()) return cb.conjunction();
            if ("free".equalsIgnoreCase(priceType)) {
                return cb.or(
                    cb.isNull(root.get("price")),
                    cb.equal(root.get("price"), 0.0)
                );
            }
            return cb.and(
                cb.isNotNull(root.get("price")),
                cb.greaterThan(root.get("price"), 0.0)
            );
        };
    }

    public static Specification<Place> hasSearch(String search) {
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

    public static Specification<Place> buildSpec(
        String category, String city,
        Double minRating, String priceType, String search
    ) {
        return Specification
            .where(hasCategory(category))
            .and(hasCity(city))
            .and(hasMinRating(minRating))
            .and(hasPriceType(priceType))
            .and(hasSearch(search));
    }
}
