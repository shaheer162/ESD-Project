package com.example.matchescrud.dto.request;

import com.example.matchescrud.model.entity.Team;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class MatchRequestDTO {
    private int spectators;
    private LocalDate date;
    private LocalTime time;
    private Team homeTeam;
    private Team awayTeam;
    private int homeGoals;
    private int awayGoals;
    private BigDecimal ticketPrice;

    public MatchRequestDTO() {
    }

    public MatchRequestDTO(int spectators, LocalDate date, LocalTime time, Team homeTeam, Team awayTeam, int homeGoals, int awayGoals, BigDecimal ticketPrice) {
        this.spectators = spectators;
        this.date = date;
        this.time = time;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeGoals = homeGoals;
        this.awayGoals = awayGoals;
        this.ticketPrice = ticketPrice;
    }

    public int getSpectators() {
        return spectators;
    }

    public void setSpectators(int spectators) {
        this.spectators = spectators;
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

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }
}
