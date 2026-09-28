package com.basira.tawsiah.Mapper;

import com.basira.tawsiah.DTO.RegisterRequestDTO;
import com.basira.tawsiah.DTO.UserAuthResponseDTO;
import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Model.Entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-28T21:55:53+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserRegistrationResponseDTO toRegistrationResponseDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserRegistrationResponseDTO.UserRegistrationResponseDTOBuilder userRegistrationResponseDTO = UserRegistrationResponseDTO.builder();

        userRegistrationResponseDTO.id( user.getId() );
        userRegistrationResponseDTO.email( user.getEmail() );
        userRegistrationResponseDTO.name( user.getName() );
        if ( user.getRole() != null ) {
            userRegistrationResponseDTO.role( user.getRole().name() );
        }
        if ( user.getStatus() != null ) {
            userRegistrationResponseDTO.status( user.getStatus().name() );
        }
        userRegistrationResponseDTO.createdAt( user.getCreatedAt() );

        return userRegistrationResponseDTO.build();
    }

    @Override
    public UserAuthResponseDTO toAuthResponseDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserAuthResponseDTO userAuthResponseDTO = new UserAuthResponseDTO();

        userAuthResponseDTO.setId( user.getId() );
        userAuthResponseDTO.setEmail( user.getEmail() );
        userAuthResponseDTO.setName( user.getName() );
        userAuthResponseDTO.setRole( user.getRole() );

        return userAuthResponseDTO;
    }

    @Override
    public User toEntity(RegisterRequestDTO registrationRequest) {
        if ( registrationRequest == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( registrationRequest.getEmail() );
        user.setPassword( registrationRequest.getPassword() );
        user.setName( registrationRequest.getName() );

        return user;
    }
}
