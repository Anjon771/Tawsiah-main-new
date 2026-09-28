package com.basira.tawsiah.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.MapPointDTO;
import com.basira.tawsiah.Service.MapService;


@RestController
@RequestMapping("/tawsiah/map")
@CrossOrigin(origins = "*")
public class MapController {

    private final MapService mapService;

    @Autowired
    public MapController(MapService mapService) {
        this.mapService = mapService;
    }

    @GetMapping("/points")
    public ResponseEntity<List<MapPointDTO>> getMapPoints() {
        List<MapPointDTO> points = mapService.getMapPoints();
        
        // If no points are found, return a 204 No Content response
        if (points.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.ok(points);
    }
    
    
}
