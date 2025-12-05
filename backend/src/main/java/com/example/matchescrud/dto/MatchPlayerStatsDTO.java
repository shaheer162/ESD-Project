package com.example.matchescrud.dto;

import java.util.UUID;

public class MatchPlayerStatsDTO {
    private Long id;
    private UUID matchUuid;
    private PlayerDTO player;
    private int goals;
    private int assists;
    private int passes;
    private int saves;

    public MatchPlayerStatsDTO() {
    }

    public MatchPlayerStatsDTO(Long id, UUID matchUuid, PlayerDTO player, int goals, int assists, int passes, int saves) {
        this.id = id;
        this.matchUuid = matchUuid;
        this.player = player;
        this.goals = goals;
        this.assists = assists;
        this.passes = passes;
        this.saves = saves;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getMatchUuid() {
        return matchUuid;
    }

    public void setMatchUuid(UUID matchUuid) {
        this.matchUuid = matchUuid;
    }

    public PlayerDTO getPlayer() {
        return player;
    }

    public void setPlayer(PlayerDTO player) {
        this.player = player;
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

