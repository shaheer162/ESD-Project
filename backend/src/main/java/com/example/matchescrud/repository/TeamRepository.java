package com.example.matchescrud.repository;


import com.example.matchescrud.model.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("SELECT t FROM Team t WHERE t.name = :teamName")
    Optional<Team> findByName(@Param("teamName") String teamName);
    
    Optional<Team> findByUsername(String username);
    Optional<Team> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Search by name
    @Query("SELECT t FROM Team t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Team> searchByName(@Param("searchTerm") String searchTerm);
}
