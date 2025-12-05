package com.example.matchescrud.service;

import com.example.matchescrud.Mapper.PlayerMapper;
import com.example.matchescrud.Mapper.TeamMapper;
import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.dto.PlayerHistoryDTO;
import com.example.matchescrud.exceptions.AlreadyExistException.PlayerAlreadyExist;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.NotFoundExceptions.PlayerNotFoundException;
import com.example.matchescrud.exceptions.NotFoundExceptions.TeamNotFoundException;
import com.example.matchescrud.model.entity.*;
import com.example.matchescrud.repository.MatchPlayerStatsRepository;
import com.example.matchescrud.repository.PlayerRepository;
import com.example.matchescrud.repository.TeamRepository;
import com.example.matchescrud.service.interfaces.IPlayerService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerServiceImp implements IPlayerService {
    
    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;
    private final MatchPlayerStatsRepository matchPlayerStatsRepository;
    private final PlayerMapper playerMapper;
    private final TeamMapper teamMapper;

    public PlayerServiceImp(PlayerRepository playerRepository, TeamRepository teamRepository,
                           MatchPlayerStatsRepository matchPlayerStatsRepository, PlayerMapper playerMapper,
                           TeamMapper teamMapper) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
        this.matchPlayerStatsRepository = matchPlayerStatsRepository;
        this.playerMapper = playerMapper;
        this.teamMapper = teamMapper;
    }

    @Override
    @Transactional
    public PlayerDTO getPlayerById(Long id) throws ApiException {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
        return playerMapper.playerToPlayerDTO(player);
    }

    @Override
    @Transactional
    public List<PlayerDTO> getPlayersByTeamId(Long teamId) throws ApiException {
        // Verify team exists
        teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException(teamId));
        
        List<Player> players = playerRepository.findByTeamId(teamId);
        return playerMapper.playerListToPlayerDTOList(players);
    }

    @Override
    @Transactional
    public PlayerDTO createPlayer(PlayerDTO playerDTO) throws ApiException {
        // Validate required fields
        if (playerDTO.getName() == null || playerDTO.getName().trim().isEmpty()) {
            throw new ApiException("Player name is required", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        
        if (playerDTO.getPosition() == null || playerDTO.getPosition().trim().isEmpty()) {
            throw new ApiException("Player position is required", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        
        // Validate team is provided
        if (playerDTO.getTeam() == null || playerDTO.getTeam().getId() == null) {
            throw new ApiException("Team is required to create a player", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        
        // Verify team exists
        Long teamId = playerDTO.getTeam().getId();
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException(teamId));
        
        // Validate jersey number
        if (playerDTO.getJerseyNumber() < 1 || playerDTO.getJerseyNumber() > 99) {
            throw new ApiException("Jersey number must be between 1 and 99", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        
        // Check if jersey number already exists for this team
        if (playerRepository.existsByTeamIdAndJerseyNumber(team.getId(), playerDTO.getJerseyNumber())) {
            throw new PlayerAlreadyExist("Player with jersey number " + playerDTO.getJerseyNumber() + 
                                        " already exists for this team");
        }
        
        Player player = playerMapper.playerDTOToPlayer(playerDTO);
        player.setTeam(team);
        
        Player savedPlayer = playerRepository.save(player);
        return playerMapper.playerToPlayerDTO(savedPlayer);
    }

    @Override
    @Transactional
    public PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO) throws ApiException {
        Player existingPlayer = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
        
        // Check if jersey number is being changed and conflicts with another player
        if (playerDTO.getJerseyNumber() != existingPlayer.getJerseyNumber()) {
            if (playerRepository.existsByTeamIdAndJerseyNumber(existingPlayer.getTeam().getId(), playerDTO.getJerseyNumber())) {
                throw new PlayerAlreadyExist("Player with jersey number " + playerDTO.getJerseyNumber() + 
                                            " already exists for this team");
            }
        }
        
        existingPlayer.setName(playerDTO.getName());
        existingPlayer.setPosition(playerDTO.getPosition());
        existingPlayer.setJerseyNumber(playerDTO.getJerseyNumber());
        
        Player updatedPlayer = playerRepository.save(existingPlayer);
        return playerMapper.playerToPlayerDTO(updatedPlayer);
    }

    @Override
    @Transactional
    public void deletePlayer(Long id) throws ApiException {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
        playerRepository.delete(player);
    }

    @Override
    @Transactional
    public List<PlayerHistoryDTO> getPlayerHistory(Long playerId) throws ApiException {
        // Fetch player with team eagerly loaded
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));
        
        // Ensure player's team is loaded - trigger lazy loading if needed
        if (player.getTeam() == null) {
            return new ArrayList<>(); // Return empty list if team is not set
        }
        Long playerTeamId = player.getTeam().getId();
        if (playerTeamId == null) {
            return new ArrayList<>();
        }
        
        // Fetch match player stats with all relationships eagerly loaded
        List<MatchPlayerStats> statsList = matchPlayerStatsRepository.findByPlayerId(playerId);
        List<PlayerHistoryDTO> history = new ArrayList<>();
        
        for (MatchPlayerStats stats : statsList) {
            Match match = stats.getMatch();
            if (match == null) {
                continue; // Skip if match is null
            }
            
            // Access teams to trigger lazy loading within transaction
            Team homeTeam = match.getHomeTeam();
            Team awayTeam = match.getAwayTeam();
            
            if (homeTeam == null || awayTeam == null) {
                continue; // Skip if teams are not loaded
            }
            
            Team opponentTeam;
            boolean isHomeMatch;
            
            if (homeTeam.getId() != null && homeTeam.getId().equals(playerTeamId)) {
                opponentTeam = awayTeam;
                isHomeMatch = true;
            } else if (awayTeam.getId() != null && awayTeam.getId().equals(playerTeamId)) {
                opponentTeam = homeTeam;
                isHomeMatch = false;
            } else {
                continue; // Skip if player's team doesn't match either team in the match
            }
            
            PlayerHistoryDTO dto = new PlayerHistoryDTO();
            dto.setMatchUuid(match.getUuid());
            dto.setDate(match.getDate());
            dto.setTime(match.getTime());
            dto.setOpponentName(opponentTeam != null && opponentTeam.getName() != null 
                    ? opponentTeam.getName() : "Unknown");
            dto.setHomeMatch(isHomeMatch);
            dto.setGoals(stats.getGoals());
            dto.setAssists(stats.getAssists());
            dto.setPasses(stats.getPasses());
            dto.setSaves(stats.getSaves());
            
            history.add(dto);
        }
        
        // Sort by date (most recent first)
        history.sort((a, b) -> {
            if (b.getDate() == null || a.getDate() == null) {
                return 0;
            }
            int dateCompare = b.getDate().compareTo(a.getDate());
            if (dateCompare != 0) {
                return dateCompare;
            }
            if (b.getTime() == null || a.getTime() == null) {
                return 0;
            }
            return b.getTime().compareTo(a.getTime());
        });
        
        return history;
    }
}

