package com.basira.tawsiah.Mapper;

import com.basira.tawsiah.DTO.LocationDTO;
import com.basira.tawsiah.DTO.MapPointDTO;
import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Place;
import com.basira.tawsiah.Model.valueObjects.Location;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-28T21:55:53+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class LocationMapperImpl implements LocationMapper {

    @Override
    public MapPointDTO toMapPoint(Place place) {
        if ( place == null ) {
            return null;
        }

        MapPointDTO mapPointDTO = new MapPointDTO();

        mapPointDTO.setLocation( locationToLocationDTO( place.getLocation() ) );
        mapPointDTO.setId( place.getID() );
        mapPointDTO.setName( place.getName() );
        if ( place.getRate() != null ) {
            mapPointDTO.setRating( place.getRate().intValue() );
        }
        mapPointDTO.setCity( place.getCity() );

        mapPointDTO.setIsEvent( false );
        mapPointDTO.setCategories( java.util.List.of(place.getCategory()) );

        enrichPlaceMapPoint( place, mapPointDTO );

        return mapPointDTO;
    }

    @Override
    public MapPointDTO toMapPoint(Event event) {
        if ( event == null ) {
            return null;
        }

        MapPointDTO mapPointDTO = new MapPointDTO();

        mapPointDTO.setLocation( locationToLocationDTO1( event.getLocation() ) );
        mapPointDTO.setId( event.getId() );
        if ( event.getRate() != null ) {
            mapPointDTO.setRating( event.getRate().intValue() );
        }
        mapPointDTO.setName( event.getName() );
        mapPointDTO.setCity( event.getCity() );

        mapPointDTO.setIsEvent( true );
        mapPointDTO.setCategories( java.util.List.of(event.getCategory()) );

        enrichEventMapPoint( event, mapPointDTO );

        return mapPointDTO;
    }

    protected LocationDTO locationToLocationDTO(Location location) {
        if ( location == null ) {
            return null;
        }

        LocationDTO locationDTO = new LocationDTO();

        locationDTO.setLatitude( location.getLatitude() );
        locationDTO.setLongitude( location.getLongitude() );

        return locationDTO;
    }

    protected LocationDTO locationToLocationDTO1(Location location) {
        if ( location == null ) {
            return null;
        }

        LocationDTO locationDTO = new LocationDTO();

        locationDTO.setLatitude( location.getLatitude() );
        locationDTO.setLongitude( location.getLongitude() );

        return locationDTO;
    }
}
