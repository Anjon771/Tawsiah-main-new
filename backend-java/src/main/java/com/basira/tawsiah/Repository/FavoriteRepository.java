package com.basira.tawsiah.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.basira.tawsiah.Model.Entities.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long userId);
    long countByUserId(Long userId);
    
}
