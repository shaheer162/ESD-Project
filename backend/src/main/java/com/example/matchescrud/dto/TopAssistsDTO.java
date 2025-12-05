package com.example.matchescrud.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TopAssistsDTO {
    private Long playerId;
    private String playerName;
    private String teamName;
    private Long teamId;
    
    private int totalAssists;
    
    private int matchesPlayed;

    public TopAssistsDTO() {
    }

    public TopAssistsDTO(Long playerId, String playerName, String teamName, Long teamId, int totalAssists, int matchesPlayed) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.teamName = teamName;
        this.teamId = teamId;
        this.totalAssists = totalAssists;
        this.matchesPlayed = matchesPlayed;
    }

    // Getters and Setters
    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    @JsonProperty("assists")
    public int getTotalAssists() {
        return totalAssists;
    }

    public void setTotalAssists(int totalAssists) {
        this.totalAssists = totalAssists;
    }

    public int getMatchesPlayed() {
        return matchesPlayed;
    }

    public void setMatchesPlayed(int matchesPlayed) {
        this.matchesPlayed = matchesPlayed;
    }
}

