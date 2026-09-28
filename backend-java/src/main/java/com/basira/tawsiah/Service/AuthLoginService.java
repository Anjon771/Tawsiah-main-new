package com.basira.tawsiah.Service;

import com.basira.tawsiah.DTO.LoginRequestDTO;
import com.basira.tawsiah.DTO.UserAuthResponseDTO;


public interface AuthLoginService {

    public UserAuthResponseDTO login(LoginRequestDTO loginRequestDTO);
    
}