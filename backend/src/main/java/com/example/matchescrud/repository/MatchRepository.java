package com.example.matchescrud.repository;

import com.example.matchescrud.model.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    // Find matches by home team with eager fetching
    @Query("SELECT DISTINCT m FROM Match m " +
           "LEFT JOIN FETCH m.homeTeam " +
           "LEFT JOIN FETCH m.awayTeam " +
           "LEFT JOIN FETCH m.stadium " +
           "WHERE m.homeTeam.id = :teamId")
    List<Match> findByHomeTeamId(@Param("teamId") Long teamId);
    
    // Find matches by away team with eager fetching
    @Query("SELECT DISTINCT m FROM Match m " +
           "LEFT JOIN FETCH m.homeTeam " +
           "LEFT JOIN FETCH m.awayTeam " +
           "LEFT JOIN FETCH m.stadium " +
           "WHERE m.awayTeam.id = :teamId")
    List<Match> findByAwayTeamId(@Param("teamId") Long teamId);
    
    // Filter matches by various criteria with eager fetching of teams
    @Query("SELECT DISTINCT m FROM Match m " +
           "LEFT JOIN FETCH m.homeTeam " +
           "LEFT JOIN FETCH m.awayTeam " +
           "LEFT JOIN FETCH m.stadium " +
           "WHERE (:divisionId IS NULL OR m.homeTeam.division.id = :divisionId OR m.awayTeam.division.id = :divisionId) AND " +
           "(:stadiumId IS NULL OR m.stadium.id = :stadiumId) AND " +
           "(:teamId IS NULL OR m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId) AND " +
           "(:startDate IS NULL OR m.date >= :startDate) AND " +
           "(:endDate IS NULL OR m.date <= :endDate)")
    List<Match> findMatchesWithFilters(
        @Param("divisionId") Long divisionId,
        @Param("stadiumId") Long stadiumId,
        @Param("teamId") Long teamId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
