package com.example.matchescrud.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TopScorerDTO {
    private Long playerId;
    private String playerName;
    private String teamName;
    private Long teamId;
    
    private int totalGoals;
    
    private int matchesPlayed;

    public TopScorerDTO() {
    }

    public TopScorerDTO(Long playerId, String playerName, String teamName, Long teamId, int totalGoals, int matchesPlayed) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.teamName = teamName;
        this.teamId = teamId;
        this.totalGoals = totalGoals;
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

    @JsonProperty("goals")
    public int getTotalGoals() {
        return totalGoals;
    }

    public void setTotalGoals(int totalGoals) {
        this.totalGoals = totalGoals;
    }

    public int getMatchesPlayed() {
        return matchesPlayed;
    }

    public void setMatchesPlayed(int matchesPlayed) {
        this.matchesPlayed = matchesPlayed;
    }
}

