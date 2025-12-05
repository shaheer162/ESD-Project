package com.example.matchescrud.dto;

import java.time.LocalDate;

public class TeamPerformanceDTO {
    private LocalDate date;
    private int wins;
    private int losses;
    private int draws;

    public TeamPerformanceDTO() {
    }

    public TeamPerformanceDTO(LocalDate date, int wins, int losses, int draws) {
        this.date = date;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
    }
}

