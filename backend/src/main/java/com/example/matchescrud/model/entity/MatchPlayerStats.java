package com.example.matchescrud.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "match_player_stats")
public class MatchPlayerStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "match_uuid", nullable = false)
    @JsonIgnoreProperties({"homeTeam", "awayTeam"})
    private Match match;
    
    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    @JsonIgnoreProperties({"team", "matchStats"})
    private Player player;
    
    private int goals;
    private int assists;
    private int passes;
    private int saves;

    public MatchPlayerStats() {
    }

    public MatchPlayerStats(Long id, Match match, Player player, int goals, int assists, int passes, int saves) {
        this.id = id;
        this.match = match;
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

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
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

