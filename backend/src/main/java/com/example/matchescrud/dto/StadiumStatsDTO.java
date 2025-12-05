package com.example.matchescrud.dto;

public class StadiumStatsDTO {
    private Long stadiumId;
    private String stadiumName;
    private int capacity;
    private int totalMatches;
    private long totalSpectators;
    private double averageAttendance;
    private double occupancyRate;

    public StadiumStatsDTO() {
    }

    public StadiumStatsDTO(Long stadiumId, String stadiumName, int capacity, int totalMatches, 
                          long totalSpectators, double averageAttendance, double occupancyRate) {
        this.stadiumId = stadiumId;
        this.stadiumName = stadiumName;
        this.capacity = capacity;
        this.totalMatches = totalMatches;
        this.totalSpectators = totalSpectators;
        this.averageAttendance = averageAttendance;
        this.occupancyRate = occupancyRate;
    }

    // Getters and Setters
    public Long getStadiumId() {
        return stadiumId;
    }

    public void setStadiumId(Long stadiumId) {
        this.stadiumId = stadiumId;
    }

    public String getStadiumName() {
        return stadiumName;
    }

    public void setStadiumName(String stadiumName) {
        this.stadiumName = stadiumName;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(int totalMatches) {
        this.totalMatches = totalMatches;
    }

    public long getTotalSpectators() {
        return totalSpectators;
    }

    public void setTotalSpectators(long totalSpectators) {
        this.totalSpectators = totalSpectators;
    }

    public double getAverageAttendance() {
        return averageAttendance;
    }

    public void setAverageAttendance(double averageAttendance) {
        this.averageAttendance = averageAttendance;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }
}

