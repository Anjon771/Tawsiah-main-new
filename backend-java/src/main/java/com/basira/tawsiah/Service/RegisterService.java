package com.basira.tawsiah.Service;

import com.basira.tawsiah.DTO.RegisterRequestDTO;
import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Model.Entities.User;


public interface RegisterService {

    public UserRegistrationResponseDTO register(User newUser);

    UserRegistrationResponseDTO register(RegisterRequestDTO registrationRequest);
    
}
