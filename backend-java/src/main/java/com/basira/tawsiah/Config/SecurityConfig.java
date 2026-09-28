package com.basira.tawsiah.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(java.util.List.of(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000"
                ));
                config.setAllowedMethods(java.util.List.of(
                    "GET", "POST", "PUT", "DELETE", "OPTIONS"
                ));
                config.setAllowedHeaders(java.util.List.of("*"));
                config.setAllowCredentials(false);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/tawsiah/auth/**").permitAll()
                .requestMatchers("/tawsiah/interests/**").permitAll()
                .requestMatchers("/tawsiah/map/**").permitAll()
                .requestMatchers("/api/v1/profile/**").permitAll()
                .requestMatchers("/api/recommendations/**").permitAll()
                .requestMatchers("/api/v1/masar/**").permitAll()
                .requestMatchers("/api/search/**").permitAll()
                .requestMatchers("/place/filter", "/event/filter").permitAll()
                .requestMatchers(HttpMethod.GET, "/place/**", "/event/**").permitAll()

                // Admin only routes
                .requestMatchers(HttpMethod.POST, "/place/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/place/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/place/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/event/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/event/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/event/**").hasRole("ADMIN")
                .requestMatchers("/tawsiah/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/tawsiah/users").hasRole("ADMIN")
                .requestMatchers("/tawsiah/users/*/suspend").hasRole("ADMIN")
                .requestMatchers("/tawsiah/users/*/ban").hasRole("ADMIN")
                .requestMatchers("/tawsiah/users/*/unblock").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/ratings/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
