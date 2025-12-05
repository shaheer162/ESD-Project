package com.example.matchescrud.dto;

import java.time.LocalDate;
import java.util.List;

public class TeamDashboardDTO {
    private Long teamId;
    private String teamName;
    
    // Key Metrics
    private int totalMatches;
    private int wins;
    private int losses;
    private int draws;
    private int goalsScored;
    private int goalsConceded;
    private int points;
    
    // Upcoming matches
    private List<TeamMatchHistoryDTO> upcomingMatches;
    
    // Past matches
    private List<TeamMatchHistoryDTO> pastMatches;
    
    // Team statistics summary
    private double winPercentage;
    private double averageGoalsScored;
    private double averageGoalsConceded;
    private String currentStreak; // e.g., "W-W-L" or "Won 3"
    
    // Player roster count
    private int totalPlayers;
    
    // Recent news/announcements (for future use)
    private List<String> announcements;

    public TeamDashboardDTO() {
    }

    public TeamDashboardDTO(Long teamId, String teamName, int totalMatches, int wins, int losses, int draws,
                           int goalsScored, int goalsConceded, int points, List<TeamMatchHistoryDTO> upcomingMatches,
                           List<TeamMatchHistoryDTO> pastMatches, double winPercentage, double averageGoalsScored,
                           double averageGoalsConceded, String currentStreak, int totalPlayers, List<String> announcements) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.totalMatches = totalMatches;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
        this.goalsScored = goalsScored;
        this.goalsConceded = goalsConceded;
        this.points = points;
        this.upcomingMatches = upcomingMatches;
        this.pastMatches = pastMatches;
        this.winPercentage = winPercentage;
        this.averageGoalsScored = averageGoalsScored;
        this.averageGoalsConceded = averageGoalsConceded;
        this.currentStreak = currentStreak;
        this.totalPlayers = totalPlayers;
        this.announcements = announcements;
    }

    // Getters and Setters
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    
    public int getTotalMatches() { return totalMatches; }
    public void setTotalMatches(int totalMatches) { this.totalMatches = totalMatches; }
    
    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }
    
    public int getLosses() { return losses; }
    public void setLosses(int losses) { this.losses = losses; }
    
    public int getDraws() { return draws; }
    public void setDraws(int draws) { this.draws = draws; }
    
    public int getGoalsScored() { return goalsScored; }
    public void setGoalsScored(int goalsScored) { this.goalsScored = goalsScored; }
    
    public int getGoalsConceded() { return goalsConceded; }
    public void setGoalsConceded(int goalsConceded) { this.goalsConceded = goalsConceded; }
    
    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
    
    public List<TeamMatchHistoryDTO> getUpcomingMatches() { return upcomingMatches; }
    public void setUpcomingMatches(List<TeamMatchHistoryDTO> upcomingMatches) { this.upcomingMatches = upcomingMatches; }
    
    public List<TeamMatchHistoryDTO> getPastMatches() { return pastMatches; }
    public void setPastMatches(List<TeamMatchHistoryDTO> pastMatches) { this.pastMatches = pastMatches; }
    
    public double getWinPercentage() { return winPercentage; }
    public void setWinPercentage(double winPercentage) { this.winPercentage = winPercentage; }
    
    public double getAverageGoalsScored() { return averageGoalsScored; }
    public void setAverageGoalsScored(double averageGoalsScored) { this.averageGoalsScored = averageGoalsScored; }
    
    public double getAverageGoalsConceded() { return averageGoalsConceded; }
    public void setAverageGoalsConceded(double averageGoalsConceded) { this.averageGoalsConceded = averageGoalsConceded; }
    
    public String getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(String currentStreak) { this.currentStreak = currentStreak; }
    
    public int getTotalPlayers() { return totalPlayers; }
    public void setTotalPlayers(int totalPlayers) { this.totalPlayers = totalPlayers; }
    
    public List<String> getAnnouncements() { return announcements; }
    public void setAnnouncements(List<String> announcements) { this.announcements = announcements; }
}

