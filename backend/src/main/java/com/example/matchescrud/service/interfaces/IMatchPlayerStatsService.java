package com.example.matchescrud.service.interfaces;

import com.example.matchescrud.dto.MatchPlayerStatsDTO;
import com.example.matchescrud.exceptions.ApiException;

import java.util.List;
import java.util.UUID;

public interface IMatchPlayerStatsService {
    MatchPlayerStatsDTO addPlayerStats(UUID matchUuid, Long playerId, MatchPlayerStatsDTO statsDTO) throws ApiException;
    MatchPlayerStatsDTO updatePlayerStats(UUID matchUuid, Long playerId, MatchPlayerStatsDTO statsDTO) throws ApiException;
    void deletePlayerStats(UUID matchUuid, Long playerId) throws ApiException;
    List<MatchPlayerStatsDTO> getMatchStats(UUID matchUuid) throws ApiException;
    MatchPlayerStatsDTO getPlayerStatsForMatch(UUID matchUuid, Long playerId) throws ApiException;
}

