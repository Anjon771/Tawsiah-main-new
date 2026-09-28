package com.basira.tawsiah.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.Request.UserUpdateNameRequestDTO;
import com.basira.tawsiah.DTO.UserProfileResponseDTO;
import com.basira.tawsiah.Service.ProfileService;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponseDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getUserProfile(id));
    }

    @PutMapping("/{id}/name")
    public ResponseEntity<UserProfileResponseDTO> updateName(
            @PathVariable Long id,
            @RequestBody UserUpdateNameRequestDTO request) {
        return ResponseEntity.ok(profileService.updateName(id, request.getName()));
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<UserProfileResponseDTO> updateAvatar(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {
        String base64Avatar = request.get("avatarBase64");
        return ResponseEntity.ok(profileService.updateAvatar(id, base64Avatar));
    }
}
