package com.basira.tawsiah.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.basira.tawsiah.DTO.LoginRequestDTO;
import com.basira.tawsiah.DTO.RegisterRequestDTO;
import com.basira.tawsiah.DTO.UserAuthResponseDTO;
import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Service.AuthLoginService;
import com.basira.tawsiah.Service.RegisterService;
import com.basira.tawsiah.Service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/tawsiah/auth")
public class AuthController {

    @Autowired
    private RegisterService registerService;

    @Autowired
    private AuthLoginService authLoginService;

    @Autowired
    private UserService userService;

    // User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registrationRequest) {
        UserRegistrationResponseDTO response = registerService.register(registrationRequest);
        return new ResponseEntity<>(response , HttpStatus.CREATED);
    }

    // User Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<UserAuthResponseDTO> login( @RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authLoginService.login(loginRequestDTO));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) { 
        return ResponseEntity.ok("Logged out successfully");
    }

    
    

}
