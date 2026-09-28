package com.basira.tawsiah.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret; // the secret key used for signing the JWT tokens, this should be a long and random string in a real application

    private long expiration; // the expiration time for the JWT tokens, in milliseconds, this determines how long the token will be valid before it expires

    // getters and setters for the properties, these are used by Spring to bind the values from the configuration file (application.yaml) to this class
    public String getSecret() { return secret; }

    public void setSecret(String secret) { this.secret = secret; }

    public long getExpiration() { return expiration; }

    public void setExpiration(long expiration) { this.expiration = expiration; }
    
}
