package com.example.matchescrud.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class PlayerHistoryDTO {
    private UUID matchUuid;
    private LocalDate date;
    private LocalTime time;
    private String opponentName;
    private boolean isHomeMatch;
    private int goals;
    private int assists;
    private int passes;
    private int saves;

    public PlayerHistoryDTO() {
    }

    public PlayerHistoryDTO(UUID matchUuid, LocalDate date, LocalTime time, String opponentName, 
                           boolean isHomeMatch, int goals, int assists, int passes, int saves) {
        this.matchUuid = matchUuid;
        this.date = date;
        this.time = time;
        this.opponentName = opponentName;
        this.isHomeMatch = isHomeMatch;
        this.goals = goals;
        this.assists = assists;
        this.passes = passes;
        this.saves = saves;
    }

    public UUID getMatchUuid() {
        return matchUuid;
    }

    public void setMatchUuid(UUID matchUuid) {
        this.matchUuid = matchUuid;
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

    public int getGoals() {
        return goals;
    }

    public void setGoals(int goals) {
        this.goals = goals;
    }

    public int getAssists() {
        return assists;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public int getPasses() {
        return passes;
    }

    public void setPasses(int passes) {
        this.passes = passes;
    }

    public int getSaves() {
        return saves;
    }

    public void setSaves(int saves) {
        this.saves = saves;
    }
}

