package com.basira.tawsiah.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.InterestDTO;
import com.basira.tawsiah.Service.InterestService;
import com.basira.tawsiah.Service.UserService;

@RestController
@RequestMapping("/tawsiah/interests")
public class InterestController {

    @Autowired
    private InterestService interestService;

    @Autowired
    private UserService userService; // to get the current user, you can also use a

    // Get all available interests for the questionnaire
    @GetMapping
    public ResponseEntity<List<InterestDTO>> getAll() {
        return ResponseEntity.ok(interestService.getAllAvailableInterests());
    }
}
