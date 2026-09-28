package com.basira.tawsiah.DTO.Response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestResponseDTO {
    private Long userId;
    private List<String> interests;
    private String city; // The English city name resolved from coordinates
}