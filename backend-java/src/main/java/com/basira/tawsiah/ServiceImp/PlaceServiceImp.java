package com.basira.tawsiah.ServiceImp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.Request.PlaceRequest;
import com.basira.tawsiah.DTO.Response.PlaceDetailResponseDTO;
import com.basira.tawsiah.DTO.Response.PlaceSummaryResponseDTO;
import com.basira.tawsiah.DTO.Update.PlaceUpdateDTO;
import com.basira.tawsiah.Exception.PlaceNotFoundException;
import com.basira.tawsiah.Mapper.PlaceMapper;
import com.basira.tawsiah.Model.Entities.Place;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Repository.PlaceSpecification;
import com.basira.tawsiah.Service.PlaceService;

@Service
public class PlaceServiceImp implements PlaceService {

    private final PlaceRepository placeRepo;
    private final PlaceMapper mapper;
    private final RedisSyncService redisSyncService;


    public PlaceServiceImp(PlaceRepository placeRepo, PlaceMapper mapper, RedisSyncService redisSyncService) {
        this.placeRepo = placeRepo;
        this.mapper = mapper;
        this.redisSyncService = redisSyncService;
    }
    

    @Override
    public PlaceDetailResponseDTO createPlace(PlaceRequest request) {
        Place place = mapper.toEntity(request);
        Place createdPlace = placeRepo.save(place);

        redisSyncService.queuePlaceForAi(mapper.toDetailResponse(createdPlace));

        return mapper.toDetailResponse(createdPlace);
    }

    @Override
    public List<PlaceSummaryResponseDTO> getAllPlaces() {
        return placeRepo.findAll()
                .stream()
                .map(mapper::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PlaceDetailResponseDTO getPlaceById(Long id) {
        Place place = placeRepo.findById(id)
                .orElseThrow(() -> new PlaceNotFoundException(id));
        return mapper.toDetailResponse(place);
    }

    @Override
    public PlaceDetailResponseDTO updatePlace(Long id, PlaceUpdateDTO request) {
        Place existingPlace = placeRepo.findById(id)
                .orElseThrow(() -> new PlaceNotFoundException(id));

        existingPlace.setName(request.getName());
        existingPlace.setDescription(request.getDescription());
        existingPlace.setCategory(request.getCategory());
        existingPlace.setCity(request.getCity());
        existingPlace.setImageURL(request.getImageURL());
        existingPlace.setLocation(request.getLocation());
        existingPlace.setSchedule(request.getSchedule());

        Place updatedPlace = placeRepo.save(existingPlace);

        redisSyncService.queuePlaceForAi(mapper.toDetailResponse(updatedPlace));

        return mapper.toDetailResponse(updatedPlace);
    }

    @Override
    public void deletePlace(Long id) {
        if (!placeRepo.existsById(id)) {
            throw new PlaceNotFoundException(id);
        }
        placeRepo.deleteById(id);

        redisSyncService.queuePlaceForAi("DELETE_PLACE: "+id);
    }

    @Override
    public List<PlaceSummaryResponseDTO> filterPlaces(
        String category, String city, Double minRating,
        String priceType, String search,
        String sortBy, String sortDir
    ) {
        Sort sort = sortDir != null && sortDir.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

        Specification<Place> spec = PlaceSpecification.buildSpec(
            category, city, minRating, priceType, search
        );

        List<Place> places = placeRepo.findAll(spec, sort);

        return places.stream()
            .map(mapper::toSummaryResponse)
            .collect(Collectors.toList());
    }
}