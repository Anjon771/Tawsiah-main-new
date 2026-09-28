package com.basira.tawsiah.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationResponseDTO {
    private String cityEn;
    private String cityAr;
    private String status; // e.g., "URL", "COOKIE", "GPS", or "DEFAULT"
}