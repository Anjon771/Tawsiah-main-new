package com.basira.tawsiah.ServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.RegisterRequestDTO;
import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Mapper.UserMapper;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Service.RegisterService;

@Service
public class RegisterServiceImp implements RegisterService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper; // Inject the mapper to convert between Entity and DTO

    // To handle user registration logic
    @Override
    public UserRegistrationResponseDTO register(User newUser) {
        
        // 1. check if email already exists
        if(userRepository.findByEmail(newUser.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists!");
        }

        // 2.encrypt the password before saving
        String encryptedPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(encryptedPassword);

        // 3. configure default role and status if not provided
        if(newUser.getRole() == null) {
            newUser.setRole(User.UserRole.USER);
        }
        if(newUser.getStatus() == null) {
            newUser.setStatus(User.UserStatus.ACTIVE);
        }

        // 4. save the user to the database
        User savedUser = userRepository.save(newUser);

        // 5. convert the saved user entity to a registration response DTO and return it
        return userMapper.toRegistrationResponseDto(savedUser);
    }

    @Override
    public UserRegistrationResponseDTO register(RegisterRequestDTO registrationRequest) {
    if(userRepository.findByEmail(registrationRequest.getEmail()).isPresent()){
        throw new RuntimeException("Email already exists!");
    }

    // convert the registration request DTO to a User entity using the mapper
    User newUser = userMapper.toEntity(registrationRequest);

    // Encode the password before saving
    newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
    newUser.setRole(User.UserRole.USER); // set default role to USER
    newUser.setStatus(User.UserStatus.ACTIVE); // set default status to ACTIVE

    User savedUser = userRepository.save(newUser);
    return userMapper.toRegistrationResponseDto(savedUser); // God help me with this mapper, I hope it works without any issues
}
}
