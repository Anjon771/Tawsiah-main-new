package com.basira.tawsiah.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.basira.tawsiah.Model.Entities.Visited;

public interface VisitedRepository extends JpaRepository<Visited, Long> {

    List<Visited> findByUserId(Long userId);

    long countByUserId(Long userId);
    
}
