package com.example.matchescrud.dto.response;

import com.example.matchescrud.dto.StadiumDTO;
import com.example.matchescrud.dto.TeamReferenceDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class MatchResponseDTO {
    private UUID uuid;
    private StadiumDTO stadium;
    private LocalDate date;
    private LocalTime time;
    private TeamReferenceDTO homeTeam;
    private TeamReferenceDTO awayTeam;
    private int homeGoals;
    private int awayGoals;
    private int spectators;
    private BigDecimal revenue;

    public MatchResponseDTO() {
    }

    public MatchResponseDTO(UUID uuid, StadiumDTO stadium, LocalDate date, LocalTime time, TeamReferenceDTO homeTeam, TeamReferenceDTO awayTeam, int homeGoals, int awayGoals, int spectators, BigDecimal revenue) {
        this.uuid = uuid;
        this.stadium = stadium;
        this.date = date;
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
        this.spectators = spectators;
        this.revenue = revenue;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public StadiumDTO getStadium() {
        return stadium;
    }

    public void setStadium(StadiumDTO stadium) {
        this.stadium = stadium;
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

    public TeamReferenceDTO getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(TeamReferenceDTO homeTeam) {
        this.homeTeam = homeTeam;
    }

    public TeamReferenceDTO getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(TeamReferenceDTO awayTeam) {
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
