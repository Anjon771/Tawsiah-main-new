package com.basira.tawsiah.Model.Entities;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    @Email(message = "Not a valid email address")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Column(nullable = false)
    // @JsonIgnore
    // @NotBlank(message = "Password is required")
    // @Size(min = 8, message = "Password must be at least 8 characters long")
    // @Pattern(
    //     regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    //     message="Password must contain at least one uppercase letter, one lowercase letter, one number"
    // )
    private String password; // FR-12: Min 8 chars, uppercase, lowercase, numbers, symbols
    
    @Column(nullable = false)
    @NotBlank(message = "Name is required")
    private String name;
    
    // @Column
    // private String phoneNumber; inter
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(nullable = true)
    private LocalDateTime suspendedUntil;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "name_last_updated_at")
    private LocalDateTime nameLastUpdatedAt;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    // FR-10: Password reset functionality
    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @ManyToMany(fetch=FetchType.LAZY , cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "user_interests",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<interest> interests = new HashSet<>();
    
    // FR-2: Interest questionnaire completion status
    @Column(name = "interests_completed", nullable = false)
    private boolean interestsCompleted = false;

    @Column(name = "vegetarian")
    private boolean vegetarian = false;
    
    @Column(name = "vegan")
    private boolean vegan = false;
    
    @Column(name = "accessibility_required")
    private boolean accessibilityRequired = false;
    
    @Column(name = "budget_range")
    private String budgetRange; // e.g., "LOW", "MEDIUM", "HIGH"
    
    // FR-24: Location permission
    @Column(name = "location_permission_granted")
    private boolean locationPermissionGranted = false;
    
    // FR-27: Notification preferences
    @Column(name = "notifications_enabled")
    private boolean notificationsEnabled = true;
    
    // NFR-4: Language preference
    @Enumerated(EnumType.STRING)
    private LanguagePreference languagePreference = LanguagePreference.ENGLISH;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_favorite_places",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "place_id")
    )
    private Set<Place> favoritePlaces = new HashSet<>();

    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_favorite_events",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private Set<Event> favoriteEvents = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_visited_places",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "place_id")
    )
    private Set<Place> visitedPlaces = new HashSet<>();
    
    //########################## Enums ###########################
    
    public enum UserRole {
        USER,           // Regular tourist
        ADMIN,          // System admin
        PROVIDER        // Event/place provider
    }

    public enum UserStatus {
        ACTIVE,
        SUSPENDED,
        BANNED
    }
    
    public enum LanguagePreference {
        ARABIC,
        ENGLISH
    }
    
    //###################### Setters and Getters #######################
    
    public long getId() {
        return this.id;
    }
    
    public void setId(long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return this.password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    // public String getPhoneNumber() {
    //     return this.phoneNumber;
    // }
    
    // public void setPhoneNumber(String phoneNumber) {
    //     this.phoneNumber = phoneNumber;
    // }
    
    public UserRole getRole() {
        return this.role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return this.status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getSuspendedUntil() {
        return this.suspendedUntil;
    }

    public void setSuspendedUntil(LocalDateTime suspendedUntil) {
        this.suspendedUntil = suspendedUntil;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastLogin() {
        return this.lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public LocalDateTime getNameLastUpdatedAt() {
        return this.nameLastUpdatedAt;
    }

    public void setNameLastUpdatedAt(LocalDateTime nameLastUpdatedAt) {
        this.nameLastUpdatedAt = nameLastUpdatedAt;
    }

    public String getAvatarUrl() {
        return this.avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public boolean isInterestsCompleted() {
        return this.interestsCompleted;
    }
    
    public void setInterestsCompleted(boolean interestsCompleted) {
        this.interestsCompleted = interestsCompleted;
    }
    
    public boolean isVegetarian() {
        return this.vegetarian;
    }
    
    public void setVegetarian(boolean vegetarian) {
        this.vegetarian = vegetarian;
    }
    
    public boolean isVegan() {
        return this.vegan;
    }
    
    public void setVegan(boolean vegan) {
        this.vegan = vegan;
    }
    
    public boolean isAccessibilityRequired() {
        return this.accessibilityRequired;
    }
    
    public void setAccessibilityRequired(boolean accessibilityRequired) {
        this.accessibilityRequired = accessibilityRequired;
    }
    
    public String getBudgetRange() {
        return this.budgetRange;
    }
    
    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }
    
    public boolean isLocationPermissionGranted() {
        return this.locationPermissionGranted;
    }
    
    public void setLocationPermissionGranted(boolean locationPermissionGranted) {
        this.locationPermissionGranted = locationPermissionGranted;
    }
    
    public boolean isNotificationsEnabled() {
        return this.notificationsEnabled;
    }
    
    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
    
    public LanguagePreference getLanguagePreference() {
        return this.languagePreference;
    }
    
    public void setLanguagePreference(LanguagePreference languagePreference) {
        this.languagePreference = languagePreference;
    }

    public void addInterest(interest interest) {
        this.interests.add(interest);
        interest.getUsers().add(this);
    }

    public void removeInterest(interest interest) {
        this.interests.remove(interest);
        interest.getUsers().remove(this);
    }

    public Set<interest> getInterests() {
        return this.interests;
    }


    // UserDetails interface methods for Spring Security authentication
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    // 2. The getUsername method returns the email as the username for authentication purposes, since users will log in using their email address. The other methods (isAccountNonExpired, isAccountNonLocked, isCredentialsNonExpired, isEnabled) return true for now, indicating that all accounts are active and valid. You can implement additional logic in these methods later if you want to support account locking, expiration, or disabling.
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
      

}