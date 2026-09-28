package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.Request.MasarRequestDTO;
import com.basira.tawsiah.DTO.Response.MasarDiscoveryDTO;
import com.basira.tawsiah.DTO.Response.MasarItineraryResponseDTO;
import com.basira.tawsiah.DTO.Response.MasarResponseDTO;

public interface MasarService {

    MasarResponseDTO generatePlans(Long userId, Double budget, List<String> interests);

    MasarResponseDTO generatePlans(MasarRequestDTO request);

    MasarDiscoveryDTO getDiscovery();

    MasarItineraryResponseDTO generateItinerary(MasarRequestDTO request);
}
