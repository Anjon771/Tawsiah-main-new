package com.basira.tawsiah.Service;

import com.basira.tawsiah.DTO.UserProfileResponseDTO;

public interface ProfileService {

    UserProfileResponseDTO getUserProfile(Long userId);

    UserProfileResponseDTO updateName(Long userId, String newName);

    UserProfileResponseDTO updateAvatar(Long userId, String base64Avatar);
}
