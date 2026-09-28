package com.basira.tawsiah.Mapper;

import org.mapstruct.Mapper;

import com.basira.tawsiah.DTO.InterestDTO;
import com.basira.tawsiah.DTO.Response.InterestResponseDTO;
import com.basira.tawsiah.Model.Entities.interest;

@Mapper(componentModel = "spring")
public interface InterestMapper {

    InterestDTO toInterestDTO(interest interest);

}