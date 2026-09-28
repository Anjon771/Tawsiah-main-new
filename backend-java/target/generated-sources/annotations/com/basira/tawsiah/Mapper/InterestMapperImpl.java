package com.basira.tawsiah.Mapper;

import com.basira.tawsiah.DTO.InterestDTO;
import com.basira.tawsiah.Model.Entities.interest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-28T21:55:53+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class InterestMapperImpl implements InterestMapper {

    @Override
    public InterestDTO toInterestDTO(interest interest) {
        if ( interest == null ) {
            return null;
        }

        InterestDTO interestDTO = new InterestDTO();

        interestDTO.setId( interest.getId() );
        interestDTO.setName( interest.getName() );
        interestDTO.setType( interest.getType() );

        return interestDTO;
    }
}
