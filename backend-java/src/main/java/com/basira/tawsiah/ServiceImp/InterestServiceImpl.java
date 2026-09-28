package com.basira.tawsiah.ServiceImp;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.InterestDTO;
import com.basira.tawsiah.DTO.Request.InterestRequestDTO;
import com.basira.tawsiah.Mapper.InterestMapper;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Model.Entities.interest;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.InterestRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Service.InterestService;
import com.basira.tawsiah.ServiceImp.GeocodingService;

@Service
public class InterestServiceImpl implements InterestService {

    @Autowired
    private InterestRepository interestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private InterestMapper interestMapper;

    @Autowired
    private GeocodingService geocodingService;



    @Override
    public List<InterestDTO> getAllAvailableInterests() {
        return interestRepository.findAll()
                .stream()
                .map(i -> new InterestDTO(
                        i.getId(),
                        i.getName(),
                        i.getType() != null ? i.getType() : "category",
                        null
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void syncedUserInterests(Long userId, List<Long> interestIds, boolean isVegetarian, boolean isVegan) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. fetch the selected interests based on the provided IDs
        List<interest> selectedInterests = interestRepository.findAllById(interestIds);

        // 3. update the user's interests by clearing existing ones and adding the new selection)
        user.getInterests().clear();
        user.getInterests().addAll(selectedInterests);

        // 4. update dietary preferences and mark the profile as completed
        user.setVegetarian(isVegetarian);
        user.setVegan(isVegan);
        user.setInterestsCompleted(true); // once this method is called, we consider the interest questionnaire as completed

        // 5. Auto-save the updated user entity due to transactional context, or explicitly save it if needed
        userRepository.save(user);
        
    }

    // get interest id from ineterstrepository
        public interest getInterestById(Long id) {
            return interestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Interest not found with id: " + id));
        }

    @Override
    public List<String> getUserInterestsAsStrings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getInterests().stream()
                .map(interest::getName)
                .collect(Collectors.toList());
    }

    @Override
    public String saveInterestsAndResolveCity(InterestRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<interest> selectedInterests = request.getInterests().stream()
                .map(String::trim)
                .map(name -> interestRepository.findByName(name)
                        .orElseGet(() -> {
                            interest newInterest = new interest();
                            newInterest.setName(name);
                            return interestRepository.save(newInterest);
                        }))
                .collect(Collectors.toList());

        user.getInterests().clear();
        user.getInterests().addAll(selectedInterests);
        user.setInterestsCompleted(true);
        userRepository.save(user);

        if (request.getLocation() != null && request.getLocation().getLatitude() != null && request.getLocation().getLongitude() != null) {
            String[] cities = geocodingService.getBilingualCity(request.getLocation().getLatitude(), request.getLocation().getLongitude());
            return cities[0];
        }

        return "makkah";
    }

}
