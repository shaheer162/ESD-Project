package com.example.matchescrud.repository;

import com.example.matchescrud.model.entity.MatchPlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchPlayerStatsRepository extends JpaRepository<MatchPlayerStats, Long> {
    @Query("SELECT mps FROM MatchPlayerStats mps " +
           "LEFT JOIN FETCH mps.match m " +
           "LEFT JOIN FETCH m.homeTeam " +
           "LEFT JOIN FETCH m.awayTeam " +
           "LEFT JOIN FETCH m.stadium " +
           "WHERE mps.player.id = :playerId")
    List<MatchPlayerStats> findByPlayerId(@Param("playerId") Long playerId);
    
    List<MatchPlayerStats> findByMatchUuid(UUID matchUuid);
    Optional<MatchPlayerStats> findByMatchUuidAndPlayerId(UUID matchUuid, Long playerId);
}

