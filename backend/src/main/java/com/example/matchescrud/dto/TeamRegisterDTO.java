package com.example.matchescrud.dto;

public class TeamRegisterDTO {
    private String name;
    private String username;
    private String password;
    private String email;
    private DivisionDTO division;
    private CityDTO city;
    private StadiumDTO stadium;

    public TeamRegisterDTO() {
    }

    public TeamRegisterDTO(String name, String username, String password, String email, DivisionDTO division, CityDTO city, StadiumDTO stadium) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.division = division;
        this.city = city;
        this.stadium = stadium;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}

