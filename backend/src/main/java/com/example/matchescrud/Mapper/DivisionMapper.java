package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.DivisionDTO;
import com.example.matchescrud.model.entity.Division;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DivisionMapper {
    public DivisionDTO divisionToDivisionDTO(Division division) {
        if (division == null) {
            return null;
        }
        return new DivisionDTO(division.getId(), division.getName());
    }

    public Division divisionDTOToDivision(DivisionDTO divisionDTO) {
        if (divisionDTO == null) {
            return null;
        }
        return new Division(divisionDTO.getId(), divisionDTO.getName());
    }

    public List<DivisionDTO> divisionListToDivisionDTOList(List<Division> divisionList) {
        if (divisionList == null) {
            return null;
        }
        return divisionList.stream()
                .map(this::divisionToDivisionDTO)
                .collect(Collectors.toList());
    }
}
