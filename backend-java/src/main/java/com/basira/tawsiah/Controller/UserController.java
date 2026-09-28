package com.basira.tawsiah.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Service.UserService;

@RestController
@RequestMapping("/tawsiah/users")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<List<UserRegistrationResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // POST /tawsiah/users/{id}/interests — save user's selected interests to database
    @PostMapping("/{id}/interests")
    public ResponseEntity<?> saveUserInterests(
        @PathVariable Long id,
        @RequestBody List<Long> interestIds
    ) {
        userService.saveInterests(id, interestIds);
        return ResponseEntity.ok("Interests saved");
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<?> suspendUser(
            @PathVariable Long id,
            @RequestParam(defaultValue = "7") int days) {
        userService.suspendUser(id, days);
        return ResponseEntity.ok("User suspended for " + days + " days");
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        userService.banUser(id);
        return ResponseEntity.ok("User permanently banned");
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long id) {
        userService.unblockUser(id);
        return ResponseEntity.ok("User unblocked");
    }
}
