package com.basira.tawsiah.Controller;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.Request.PlaceRequest;
import com.basira.tawsiah.DTO.Response.PlaceDetailResponseDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;
import com.basira.tawsiah.DTO.Update.PlaceUpdateDTO;
import com.basira.tawsiah.Service.PlaceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Place Controller", description = "basic CRUD operations for place API")
@RestController
@RequestMapping("/place")
public class PlaceController {

    // Rahq05 : vvv Let this comment, if we faced a simialr problem this will be the solution vvv

    // replace with constructor injection — @Autowired field injection is discouraged in modern Spring
    // if NullPointerException or dependency injection errors appear, refactor to constructor injection
    // i just applied it dont worry :)

    //@Autowired
    private PlaceService placeService;

    public PlaceController(PlaceService placeService){
        this.placeService = placeService;
    }
    

    // Rahq05: returns list of places 
    @Operation(summary = "Get all places", description = "Returns a summary list of all places")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping
    public ResponseEntity<List<PlaceSummaryResponseDTO>> getAllPlaces(){

        List<PlaceSummaryResponseDTO> responseDtoList =placeService.getAllPlaces(); 
        return new ResponseEntity<>(responseDtoList , HttpStatus.OK);
    }

    //Rahq05: get place by id
    @Operation(summary = "Get place by ID", description = "Returns full details of a single place")
    @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Place found"),
    @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailResponseDTO> getPlaceByID(
            @Parameter(description = "ID of the place to retrieve") @PathVariable Long id){
        
        PlaceDetailResponseDTO response = placeService.getPlaceById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    // Rahq05: i need to find a way to verify if it added succesfully or not 
    // Rahq05: creates a place with passed body 
    @Operation(summary = "Create a place", description = "Creates a new place and returns its full details")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Place created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public ResponseEntity<PlaceDetailResponseDTO> createPlace(@Valid @RequestBody PlaceRequest request){
        
        try{

        PlaceDetailResponseDTO response =placeService.createPlace(request);
        return new ResponseEntity<>(response,HttpStatus.CREATED);

        }catch(DataIntegrityViolationException e){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        

    }

    // Rahq05: deletes a place (nothing is returned even if not found)
    @Operation(summary = "Delete a place", description = "Deletes a place by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Place deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(
            @Parameter(description = "ID of the place to delete") @PathVariable Long id){ 

        placeService.deletePlace(id); 
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);  

    }

    // Rahq05: Update place with given ID and body
    @Operation(summary = "Update a place", description = "Updates an existing place by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Place updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request body"),
        @ApiResponse(responseCode = "404", description = "Place not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PlaceDetailResponseDTO> updatePlace(
            @Parameter(description = "ID of the place to update") @PathVariable Long id,
            @Valid @RequestBody PlaceUpdateDTO update){

        PlaceDetailResponseDTO response = placeService.updatePlace(id, update);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @Operation(summary = "Filter places", description = "Returns filtered and sorted places based on query parameters")
    @ApiResponse(responseCode = "200", description = "Filtered list retrieved successfully")
    @GetMapping("/filter")
    public ResponseEntity<List<PlaceSummaryResponseDTO>> filterPlaces(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String priceType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "rate") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir) {

        List<PlaceSummaryResponseDTO> results = placeService.filterPlaces(
            category, city, minRating, priceType, search, sortBy, sortDir
        );
        return ResponseEntity.ok(results);
    }

}