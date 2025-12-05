package com.example.matchescrud.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    private UUID uuid;
    private LocalDate date;
    private LocalTime time;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, updatable = false)
    @JsonIgnore
    private Team homeTeam;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, updatable = false)
    @JsonIgnore
    private Team awayTeam;
    private int homeGoals;
    private int awayGoals;
    @ManyToOne
    @JoinColumn(name = "stadium_id")
    private Stadium stadium;
    private int spectators;
    private BigDecimal revenue;

    public Match() {
    }

    public Match(UUID uuid, LocalDate date, LocalTime time, Team homeTeam, Team awayTeam, int homeGoals, int awayGoals, Stadium stadium, int spectators, BigDecimal revenue) {
        this.uuid = uuid;
        this.date = date;
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
        this.stadium = stadium;
        this.spectators = spectators;
        this.revenue = revenue;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public Team getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(Team homeTeam) {
        this.homeTeam = homeTeam;
    }

    public Team getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(Team awayTeam) {
        this.awayTeam = awayTeam;
    }

    public int getHomeGoals() {
        return homeGoals;
    }

    public void setHomeGoals(int homeGoals) {
        this.homeGoals = homeGoals;
    }

    public int getAwayGoals() {
        return awayGoals;
    }

    public void setAwayGoals(int awayGoals) {
        this.awayGoals = awayGoals;
    }

    public Stadium getStadium() {
        return stadium;
    }

    public void setStadium(Stadium stadium) {
        this.stadium = stadium;
    }

    public int getSpectators() {
        return spectators;
    }

    public void setSpectators(int spectators) {
        this.spectators = spectators;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }
}
