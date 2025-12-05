package com.example.matchescrud.dto;

import com.example.matchescrud.model.entity.Team;

public class PlayerDTO {
    private Long id;
    private String name;
    private String position;
    private int jerseyNumber;
    private TeamDTO team;

    public PlayerDTO() {
    }

    public PlayerDTO(Long id, String name, String position, int jerseyNumber, TeamDTO team) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.jerseyNumber = jerseyNumber;
        this.team = team;
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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public int getJerseyNumber() {
        return jerseyNumber;
    }

    public void setJerseyNumber(int jerseyNumber) {
        this.jerseyNumber = jerseyNumber;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }
}

