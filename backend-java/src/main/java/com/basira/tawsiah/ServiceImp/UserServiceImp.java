package com.basira.tawsiah.ServiceImp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.UserRegistrationResponseDTO;
import com.basira.tawsiah.Mapper.UserMapper;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Model.Entities.interest;
import com.basira.tawsiah.Repository.InterestRepository;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Service.UserService;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterestRepository interestRepository;

    @Autowired
    private UserMapper userMapper; 

    @Override
    public List<UserRegistrationResponseDTO> getAllUsers() {
    return userRepository.findAll() // this returns a List<User> from the database
            .stream()
            .map(userMapper::toRegistrationResponseDto) // convert each User entity to a UserRegistrationResponseDTO using the mapper to avoid exposing sensitive data
            .collect(Collectors.toList()); // tbh this is just a fancy way to convert the stream back to a List<UserRegistrationResponseDTO> 
    }

    //get user by id
    @Override
    public User getUserById(Long id) throws RuntimeException {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public void saveInterests(Long userId, List<Long> interestIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<interest> selectedInterests = interestRepository.findAllById(interestIds);

        user.getInterests().clear();
        user.getInterests().addAll(selectedInterests);
        user.setInterestsCompleted(true);

        userRepository.save(user);
    }

    @Override
    public void suspendUser(Long id, int days) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.SUSPENDED);
        user.setSuspendedUntil(LocalDateTime.now().plusDays(days));
        userRepository.save(user);
    }

    @Override
    public void banUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.BANNED);
        user.setSuspendedUntil(null);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.ACTIVE);
        user.setSuspendedUntil(null);
        userRepository.save(user);
    }

}
