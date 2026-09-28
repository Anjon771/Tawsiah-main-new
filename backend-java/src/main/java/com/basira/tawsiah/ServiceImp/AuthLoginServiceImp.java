package com.basira.tawsiah.ServiceImp;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.LoginRequestDTO;
import com.basira.tawsiah.DTO.UserAuthResponseDTO;
import com.basira.tawsiah.Exception.AuthenticationException;
import com.basira.tawsiah.Mapper.UserMapper;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Service.AuthLoginService;
import com.basira.tawsiah.Service.JwtService;

@Service
public class AuthLoginServiceImp implements AuthLoginService {

    @Autowired 
    private UserRepository userRepository;

    @Autowired 
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper; // inject the mapper

    @Autowired 
    private JwtService jwtService;

    @Override
    public UserAuthResponseDTO login(LoginRequestDTO loginRequestDTO){

        String email = loginRequestDTO.getEmail() != null
                ? loginRequestDTO.getEmail().trim()
                : null;

        System.out.println("########## Attempting login for email: " + email);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                System.err.println("############ DATABASE ERROR: Email not found!");
                return new AuthenticationException("Invalid email or password");
            });

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        // Check user status before allowing login
        if (user.getStatus() == User.UserStatus.BANNED) {
            throw new AuthenticationException("Your account has been permanently banned");
        }

        if (user.getStatus() == User.UserStatus.SUSPENDED) {
            if (user.getSuspendedUntil() != null && LocalDateTime.now().isBefore(user.getSuspendedUntil())) {
                throw new AuthenticationException(
                    "Your account is suspended until " + user.getSuspendedUntil()
                );
            } else {
                // Auto-lift expired suspension
                user.setStatus(User.UserStatus.ACTIVE);
                user.setSuspendedUntil(null);
            }
        }

        // 3. Update the user's last login time and save the user entity.
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

         String token = jwtService.generateToken(user.getEmail());

        // Map User entity to UserAuthResponseDTO
        UserAuthResponseDTO responseDTO = userMapper.toAuthResponseDto(user);
        responseDTO.setToken(token);
        return responseDTO;
    }

}
 
