package com.example.matchescrud.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class TeamMatchHistoryDTO {
    private LocalDate date;
    private LocalTime time;
    private StadiumDTO stadium;
    private int homeGoals;
    private int awayGoals;
    private int spectators;
    private String opponentName;
    private boolean isHomeMatch;

    public TeamMatchHistoryDTO() {
    }

    public TeamMatchHistoryDTO(LocalDate date, LocalTime time, StadiumDTO stadium, 
                              int homeGoals, int awayGoals, int spectators, 
                              String opponentName, boolean isHomeMatch) {
        this.date = date;
        this.time = time;
        this.stadium = stadium;
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
        this.spectators = spectators;
        this.opponentName = opponentName;
        this.isHomeMatch = isHomeMatch;
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

    public StadiumDTO getStadium() {
        return stadium;
    }

    public void setStadium(StadiumDTO stadium) {
        this.stadium = stadium;
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

    public String getOpponentName() {
        return opponentName;
    }

    public void setOpponentName(String opponentName) {
        this.opponentName = opponentName;
    }

    public boolean isHomeMatch() {
        return isHomeMatch;
    }

    public void setHomeMatch(boolean homeMatch) {
        isHomeMatch = homeMatch;
    }
}

