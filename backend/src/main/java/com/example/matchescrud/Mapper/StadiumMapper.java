package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.StadiumDTO;
import com.example.matchescrud.model.entity.Stadium;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StadiumMapper {
    public StadiumDTO stadiumToStadiumDTO(Stadium stadium) {
        if (stadium == null) {
            return null;
        }
        return new StadiumDTO(stadium.getId(), stadium.getName(), stadium.getCapacity());
    }

    public Stadium stadiumDTOToStadium(StadiumDTO stadiumDTO) {
        if (stadiumDTO == null) {
            return null;
        }
        return new Stadium(stadiumDTO.getId(), stadiumDTO.getName(), stadiumDTO.getCapacity());
    }

    public List<StadiumDTO> stadiumListToStadiumDTOList(List<Stadium> stadiums) {
        if (stadiums == null) {
            return null;
        }
        return stadiums.stream()
                .map(this::stadiumToStadiumDTO)
                .collect(Collectors.toList());
    }
}
