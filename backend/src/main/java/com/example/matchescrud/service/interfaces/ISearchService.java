package com.example.matchescrud.service.interfaces;

import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.response.MatchResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface ISearchService {
    List<TeamDTO> searchTeams(String query);
    List<PlayerDTO> searchPlayers(String query);
    List<PlayerDTO> filterPlayers(Long teamId, String position, Integer minJersey, Integer maxJersey);
    List<MatchResponseDTO> filterMatches(Long divisionId, Long stadiumId, Long teamId, LocalDate startDate, LocalDate endDate);
}

