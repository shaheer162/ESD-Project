package com.example.matchescrud.service.interfaces;

import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.dto.PlayerHistoryDTO;
import com.example.matchescrud.exceptions.ApiException;

import java.util.List;

public interface IPlayerService {
    // Get
    PlayerDTO getPlayerById(Long id) throws ApiException;
    List<PlayerDTO> getPlayersByTeamId(Long teamId) throws ApiException;
    List<PlayerHistoryDTO> getPlayerHistory(Long playerId) throws ApiException;

    // Post
    PlayerDTO createPlayer(PlayerDTO playerDTO) throws ApiException;

    // Put
    PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO) throws ApiException;

    // Delete
    void deletePlayer(Long id) throws ApiException;
}

