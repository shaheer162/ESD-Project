package com.example.matchescrud.dto;

import com.example.matchescrud.dto.response.MatchResponseDTO;

import java.util.List;

public class TeamDTO {
    private Long id;
    private String name;
    private String username;
    private String password;
    private String email;
    private DivisionDTO division;
    private CityDTO city;
    private StadiumDTO stadium;
    private List<MatchResponseDTO> homeMatches;
    private List<MatchResponseDTO> awayMatches;

    public TeamDTO() {
    }

    public TeamDTO(Long id, String name, DivisionDTO division, CityDTO city, StadiumDTO stadium, List<MatchResponseDTO> homeMatches, List<MatchResponseDTO> awayMatches) {
        this.id = id;
        this.name = name;
        this.division = division;
        this.city = city;
        this.stadium = stadium;
        this.homeMatches = homeMatches;
        this.awayMatches = awayMatches;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DivisionDTO getDivision() {
        return division;
    }

    public void setDivision(DivisionDTO division) {
        this.division = division;
    }

    public CityDTO getCity() {
        return city;
    }

    public void setCity(CityDTO city) {
        this.city = city;
    }

    public StadiumDTO getStadium() {
        return stadium;
    }

    public void setStadium(StadiumDTO stadium) {
        this.stadium = stadium;
    }

    public List<MatchResponseDTO> getHomeMatches() {
        return homeMatches;
    }

    public void setHomeMatches(List<MatchResponseDTO> homeMatches) {
        this.homeMatches = homeMatches;
    }

    public List<MatchResponseDTO> getAwayMatches() {
        return awayMatches;
    }

    public void setAwayMatches(List<MatchResponseDTO> awayMatches) {
        this.awayMatches = awayMatches;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
