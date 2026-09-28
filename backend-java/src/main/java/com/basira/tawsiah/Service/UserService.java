package com.basira.tawsiah.Service;

import java.util.List;

import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Model.Entities.User;

public interface UserService {

    List<UserRegistrationResponseDTO> getAllUsers();

    public User getUserById(Long id) throws RuntimeException;

    void saveInterests(Long userId, List<Long> interestIds);

    void suspendUser(Long id, int days);

    void banUser(Long id);

    void unblockUser(Long id);

}
