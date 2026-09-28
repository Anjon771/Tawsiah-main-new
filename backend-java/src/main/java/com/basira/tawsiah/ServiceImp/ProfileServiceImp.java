package com.basira.tawsiah.ServiceImp;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.basira.tawsiah.DTO.InterestDTO;
import com.basira.tawsiah.DTO.Response.RatingResponseDTO;
import com.basira.tawsiah.DTO.UserProfileResponseDTO;
import com.basira.tawsiah.Exception.ResourceNotFoundException;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Repository.FavoriteRepository;
import com.basira.tawsiah.Repository.RatingRepository;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Repository.VisitedRepository;
import com.basira.tawsiah.Service.ProfileService;
import com.basira.tawsiah.Service.RatingService;

@Service
public class ProfileServiceImp implements ProfileService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private VisitedRepository visitedRepository;
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private RatingService ratingService;

    @Override
    public UserProfileResponseDTO getUserProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildProfileDTO(user);
    }

    @Override
    public UserProfileResponseDTO updateName(Long userId, String newName) {
        if (!StringUtils.hasText(newName) || newName.trim().length() < 2) {
            throw new IllegalArgumentException("Name must be at least 2 characters");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 7-day cooldown: null means never updated → allowed
        if (user.getNameLastUpdatedAt() != null) {
            if (user.getNameLastUpdatedAt().plusDays(7).isAfter(LocalDateTime.now())) {
                throw new IllegalStateException("Name can only be updated once every 7 days");
            }
        }

        user.setName(newName.trim());
        user.setNameLastUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return buildProfileDTO(user);
    }

    @Override
    public UserProfileResponseDTO updateAvatar(Long userId, String base64Avatar) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!StringUtils.hasText(base64Avatar)) {
            throw new IllegalArgumentException("Avatar data is required");
        }

        // Basic validation: must be a data URL
        if (!base64Avatar.startsWith("data:image/")) {
            throw new IllegalArgumentException("Invalid image format");
        }

        user.setAvatarUrl(base64Avatar);
        userRepository.save(user);

        return buildProfileDTO(user);
    }

    private UserProfileResponseDTO buildProfileDTO(User user) {
        UserProfileResponseDTO profile = new UserProfileResponseDTO();
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setLanguage(user.getLanguagePreference().name());
        profile.setAvatarUrl(user.getAvatarUrl());
        profile.setNameLastUpdatedAt(user.getNameLastUpdatedAt());

        // Compute whether user can update name
        boolean canUpdate = true;
        if (user.getNameLastUpdatedAt() != null) {
            canUpdate = user.getNameLastUpdatedAt().plusDays(7).isBefore(LocalDateTime.now());
        }
        profile.setCanUpdateName(canUpdate);

        Map<String, Integer> stats = new HashMap<>();
        stats.put("favoritesCount", (int) favoriteRepository.countByUserId(user.getId()));
        stats.put("visitedCount", (int) visitedRepository.countByUserId(user.getId()));
        stats.put("reviewsCount", (int) ratingRepository.countByUser_Id(user.getId()));
        profile.setStats(stats);

        profile.setInterests(user.getInterests().stream()
                .map(i -> {
                    InterestDTO dto = new InterestDTO(i.getId(), i.getName());
                    dto.setType(i.getType() != null ? i.getType() : "category");
                    return dto;
                })
                .collect(Collectors.toList()));

        List<RatingResponseDTO> userReviews = ratingService.getRatingsByUserId(user.getId());
        profile.setReviews(userReviews);

        return profile;
    }
}
