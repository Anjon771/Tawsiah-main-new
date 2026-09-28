package com.basira.tawsiah.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Model.Entities.interest;

@Repository
public interface InterestRepository extends JpaRepository<interest, Long> {

    Optional<interest> findById(Long id);

    //to retrive all intersts by userID
    List<interest> findByUsersId(Long id);

    Optional<interest> findByName(String formattedName);

}