package com.basira.tawsiah.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.basira.tawsiah.DTO.RegisterRequestDTO;
import com.basira.tawsiah.DTO.UserAuthResponseDTO;
import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Model.Entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserRegistrationResponseDTO toRegistrationResponseDto(User user);

    UserAuthResponseDTO toAuthResponseDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    User toEntity(RegisterRequestDTO registrationRequest);

   

    

}
