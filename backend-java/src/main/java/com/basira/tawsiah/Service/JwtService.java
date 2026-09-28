package com.basira.tawsiah.Service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    public String generateToken(String email);

    public String extractEmail(String token);

    public boolean isTokenExpired(String token);

    public boolean isTokenValid(String token, UserDetails userDetails);
}
