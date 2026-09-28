package com.basira.tawsiah.ServiceImp;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.Config.JwtProperties;
import com.basira.tawsiah.Service.JwtService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtServiceImp implements JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    @Autowired
    private JwtProperties jwtProperties;

    // Generate a JWT token for the given email
    @Override
    public String generateToken(String email) {
        return Jwts.builder() // here it use the Jwts builder to create a new token, set the subject to the email, set the issued date and expiration date, sign the token with the secret key, and compact it to a string
                .setSubject(email) // set the subject of the token to the email, this is the information that will be stored in the token and can be extracted later
                .setIssuedAt(new Date(System.currentTimeMillis())) // set the issued date to the current time, this is used to determine when the token was created
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration())) // set the expiration date to the current time plus the expiration time, this is used to determine when the token will expire
                .signWith(getSignInKey()) // sign the token with the secret key, this is used to validate the token's signature when it is parsed later
                .compact(); // compact the token to a string, this is the final token that will be returned to the client and used for authentication in subsequent requests
    }

    // Extract email from the token
    @Override
    public String extractEmail(String token) {
        return Jwts.parserBuilder() // here it use parserBuilder to build the parser with the signing key, then parse the token and extract the subject (email)
                .setSigningKey(getSignInKey()) // set the signing key to validate the token's signature
                .build() // build the parser
                .parseClaimsJws(token) // parse the token and validate its signature, if the token is invalid or expired, it will throw an exception
                .getBody() // get the body of the token, which contains the claims (including the subject)
                .getSubject(); // return the subject (email) from the token
    }

    @Override
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractEmail(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private Date extractExpiration(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    
}
