package com.basira.tawsiah.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.basira.tawsiah.Model.Entities.Place;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long>, JpaSpecificationExecutor<Place> {

   List<Place> findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrCategoryIgnoreCase(
        String name, String city, String category
    );

    @Query("SELECT DISTINCT p.city FROM Place p WHERE p.city IS NOT NULL")
    List<String> findAllDistinctCities();

    @Query("SELECT DISTINCT p.category FROM Place p WHERE p.category IS NOT NULL")
    List<String> findAllDistinctCategories();

}
