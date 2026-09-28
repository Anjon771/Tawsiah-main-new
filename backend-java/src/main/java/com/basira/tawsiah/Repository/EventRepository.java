package com.basira.tawsiah.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.basira.tawsiah.Model.Entities.Event;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    List<Event> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
        String name, String category
    );

    List<Event> findTop10ByOrderByRateDesc();

    List<Event> findTop10ByCityOrderByRateDesc(String city);

    @Query("SELECT DISTINCT e.city FROM Event e WHERE e.city IS NOT NULL")
    List<String> findAllDistinctCities();

    @Query("SELECT DISTINCT e.category FROM Event e WHERE e.category IS NOT NULL")
    List<String> findAllDistinctCategories();

}
