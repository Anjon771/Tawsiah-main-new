package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.InterestDTO;
import com.basira.tawsiah.DTO.Request.InterestRequestDTO;

public interface InterestService {

    List<InterestDTO> getAllAvailableInterests();

    

    void syncedUserInterests(Long userId, List<Long> interestIds, boolean isVegetarian, boolean isVegan);



    String saveInterestsAndResolveCity(InterestRequestDTO request);



    List<String> getUserInterestsAsStrings(Long userId);

}