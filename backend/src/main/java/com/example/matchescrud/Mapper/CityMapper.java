package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.CityDTO;
import com.example.matchescrud.model.entity.City;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CityMapper {
    public CityDTO cityToCityDTO(City city) {
        if (city == null) {
            return null;
        }
        return new CityDTO(city.getId(), city.getName());
    }

    public City cityDTOToCity(CityDTO cityDTO) {
        if (cityDTO == null) {
            return null;
        }
        return new City(cityDTO.getId(), cityDTO.getName());
    }

    public List<CityDTO> cityListToCityDTOList(List<City> cities) {
        if (cities == null) {
            return null;
        }
        return cities.stream()
                .map(this::cityToCityDTO)
                .collect(Collectors.toList());
    }
}
