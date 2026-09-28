package com.basira.tawsiah.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.basira.tawsiah.Model.Entities.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByEvent_Id(Long eventId);

    List<Rating> findByUser_Id(Long userId);

   long countByUser_Id(Long userId); // added method to count ratings by user ID

}
