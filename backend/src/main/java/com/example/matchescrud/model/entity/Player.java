package com.example.matchescrud.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "player")
@JsonIgnoreProperties({"matchStats"})
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String position; // e.g., "Forward", "Midfielder", "Defender", "Goalkeeper"
    
    private int jerseyNumber;
    
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnoreProperties({"homeMatches", "awayMatches", "players"})
    private Team team;
    
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchPlayerStats> matchStats = new ArrayList<>();

    public Player() {
    }

    public Player(Long id, String name, String position, int jerseyNumber, Team team) {
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

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public List<MatchPlayerStats> getMatchStats() {
        return matchStats;
    }

    public void setMatchStats(List<MatchPlayerStats> matchStats) {
        this.matchStats = matchStats;
    }
}

