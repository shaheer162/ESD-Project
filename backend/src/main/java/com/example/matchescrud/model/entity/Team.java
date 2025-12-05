package com.example.matchescrud.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team")
@JsonIgnoreProperties({"homeMatches", "awayMatches", "players"})
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    // Team authentication fields
    @Column(unique = true)
    private String username;
    private String password;
    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "homeTeam", fetch = FetchType.LAZY)
    private List<Match> homeMatches = new ArrayList<>();

    @OneToMany(mappedBy = "awayTeam", fetch = FetchType.LAZY)
    private List<Match> awayMatches = new ArrayList<>();
    
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Player> players = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "division_id")
    private Division division;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @ManyToOne
    @JoinColumn(name = "stadium_id")
    private Stadium stadium;

    public Team() {
    }

    public Team(Long id, String name, List<Match> homeMatches, List<Match> awayMatches, Division division, City city, Stadium stadium) {
        this.id = id;
        this.name = name;
        this.homeMatches = homeMatches;
        this.awayMatches = awayMatches;
        this.division = division;
        this.city = city;
        this.stadium = stadium;
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

    public List<Match> getHomeMatches() {
        return homeMatches;
    }

    public void setHomeMatches(List<Match> homeMatches) {
        this.homeMatches = homeMatches;
    }

    public List<Match> getAwayMatches() {
        return awayMatches;
    }

    public void setAwayMatches(List<Match> awayMatches) {
        this.awayMatches = awayMatches;
    }

    public Division getDivision() {
        return division;
    }

    public void setDivision(Division division) {
        this.division = division;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Stadium getStadium() {
        return stadium;
    }

    public void setStadium(Stadium stadium) {
        this.stadium = stadium;
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

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }
}
