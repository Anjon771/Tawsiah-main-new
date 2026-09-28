package com.basira.tawsiah.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.SearchResultDTO;
import com.basira.tawsiah.Service.SearchService;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResultDTO> search(@RequestParam("q") String query) {
        // check if the query is null or empty, if so return bad request
        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    
        // 1. call the search service to perform the global search and get the results
        SearchResultDTO results = searchService.globalSearch(query);
    
        // 2. return the results wrapped in a ResponseEntity with status 200 OK
        return ResponseEntity.ok(results);
    }
    
}
