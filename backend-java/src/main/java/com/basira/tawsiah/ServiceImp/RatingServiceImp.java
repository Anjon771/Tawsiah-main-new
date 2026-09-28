package com.basira.tawsiah.ServiceImp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;



import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.Request.RatingRequestDTO;
import com.basira.tawsiah.DTO.Response.RatingResponseDTO;
import com.basira.tawsiah.Exception.EventNotFoundException;
import com.basira.tawsiah.Mapper.RatingMapper;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Rating;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.RatingRepository;
import com.basira.tawsiah.Repository.UserRepository;
import com.basira.tawsiah.Service.RatingService;

@Service
public class RatingServiceImp implements RatingService{

    private final RatingRepository ratingRepository;
    private final EventRepository eventRepository; // You need this to update the Event
    private final RatingMapper ratingMapper;
    private final UserRepository userRepository;


    public RatingServiceImp(RatingRepository ratingRepository, EventRepository eventRepository, RatingMapper ratingMapper, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.eventRepository = eventRepository;
        this.ratingMapper = ratingMapper;
        this.userRepository = userRepository;
    }

    @Override
    public RatingResponseDTO addRating(RatingRequestDTO request) {
       
       

        //find event in repo by id given from ratingRequest and if not found an exception will be thrown
        Event event = eventRepository.findById(request.getEventId()) 
            .orElseThrow(()-> new EventNotFoundException(request.getEventId()));

        Rating rating = ratingMapper.toEntity(request);

        rating.setEvent(event);
        rating.setRatingDate(LocalDate.now());

        if (request.getUserID() != null) {
            User user = userRepository.findById(request.getUserID()).orElse(null);
            rating.setUser(user);
        }

        ratingRepository.save(rating);

        List<Rating> ratingList = ratingRepository.findByEvent_Id(request.getEventId());

        //calculates all ratings then give rounded final rating to event.setRate()
        event.setRate(CalculateRating(ratingList));
        
        //save newly updated rating of event to repo
        eventRepository.save(event);

        RatingResponseDTO reponse = ratingMapper.toResponseDTO(rating);

        return reponse;
    }

    

    @Override
    public List<RatingResponseDTO> getRatingByEventId(Long eventId) {

        List<Rating> ratingList = ratingRepository.findByEvent_Id(eventId);
        List<RatingResponseDTO> response = new ArrayList<>();

        for(Rating rating : ratingList){
            RatingResponseDTO dto = ratingMapper.toResponseDTO(rating);
            response.add(dto);
        }

        return response;
    }

    @Override
    public List<RatingResponseDTO> getRatingsByUserId(Long userId) {
        List<Rating> ratingList = ratingRepository.findByUser_Id(userId);
        List<RatingResponseDTO> response = new ArrayList<>();

        for (Rating rating : ratingList) {
            RatingResponseDTO dto = ratingMapper.toResponseDTO(rating);
            response.add(dto);
        }

        return response;
    }

    @Override
    public void deleteRating(Long id) {
        if (!ratingRepository.existsById(id)) {
            throw new RuntimeException("Rating not found");
        }
        ratingRepository.deleteById(id);
    }
    

    // this method gathers all ratings for an Event and gets the average in only-half form {1.5 , 2.5 , 2.0 ,....}
    private Double CalculateRating(List<Rating> ratingList) {
    if (ratingList == null || ratingList.isEmpty()) {
        return 0.0;
    }

    double sum = 0.0;
    for (Rating rating : ratingList) {
        sum += rating.getRating();
    }

    double average = sum / ratingList.size();

    double clamped = Math.max(1.0, Math.min(5.0, average));

    return Math.round(clamped * 2.0) / 2.0;
}
    
}
