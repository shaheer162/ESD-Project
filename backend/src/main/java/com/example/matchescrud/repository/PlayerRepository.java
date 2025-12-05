package com.example.matchescrud.repository;

import com.example.matchescrud.model.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamId(Long teamId);
    Optional<Player> findByTeamIdAndJerseyNumber(Long teamId, int jerseyNumber);
    boolean existsByTeamIdAndJerseyNumber(Long teamId, int jerseyNumber);
    
    // Search by name
    @Query("SELECT p FROM Player p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Player> searchByName(@Param("searchTerm") String searchTerm);
    
    // Filter by position
    @Query("SELECT p FROM Player p WHERE (:teamId IS NULL OR p.team.id = :teamId) AND (:position IS NULL OR LOWER(p.position) = LOWER(:position)) AND (:minJersey IS NULL OR p.jerseyNumber >= :minJersey) AND (:maxJersey IS NULL OR p.jerseyNumber <= :maxJersey)")
    List<Player> filterPlayers(@Param("teamId") Long teamId, @Param("position") String position, @Param("minJersey") Integer minJersey, @Param("maxJersey") Integer maxJersey);
}

