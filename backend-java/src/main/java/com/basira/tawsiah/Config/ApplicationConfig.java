package com.basira.tawsiah.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Repository.UserRepository;

@Configuration

public class ApplicationConfig {

    private final UserRepository repository;


    public ApplicationConfig(UserRepository repository) {
        this.repository = repository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(); // Use BCrypt for password hashing 
    }

    @Bean
    public CommandLineRunner setupDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "Admin.test@uqu.edu.sa"; // the base email for the primary admin user
            
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setName("Admin acc");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin_123456TE")); // A default strong password for the admin user, should be changed after first login
                admin.setRole(User.UserRole.ADMIN); // Assign the ADMIN role
                admin.setStatus(User.UserStatus.ACTIVE); // Ensure active status

                userRepository.save(admin);
                System.out.println("Default Admin created successfully.");
            } else {
                // Already exists, ensure it has the ADMIN role
                User existingUser = userRepository.findByEmail(adminEmail).get();
                boolean updated = false;
                if (existingUser.getRole() != User.UserRole.ADMIN) {
                    existingUser.setRole(User.UserRole.ADMIN);
                    updated = true;
                }
                if (existingUser.getStatus() == null) {
                    existingUser.setStatus(User.UserStatus.ACTIVE);
                    updated = true;
                }
                if (updated) {
                    userRepository.save(existingUser);
                    System.out.println("Default admin account updated.");
                }
            }
        };
    }
    
}
