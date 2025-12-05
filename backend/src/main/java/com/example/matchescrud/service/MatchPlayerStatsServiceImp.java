package com.example.matchescrud.service;

import com.example.matchescrud.Mapper.MatchPlayerStatsMapper;
import com.example.matchescrud.dto.MatchPlayerStatsDTO;
import com.example.matchescrud.exceptions.AlreadyExistException.PlayerStatsAlreadyExist;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.NotFoundExceptions.MatchNotFoundException;
import com.example.matchescrud.exceptions.NotFoundExceptions.PlayerNotFoundException;
import com.example.matchescrud.model.entity.Match;
import com.example.matchescrud.model.entity.MatchPlayerStats;
import com.example.matchescrud.model.entity.Player;
import com.example.matchescrud.repository.MatchPlayerStatsRepository;
import com.example.matchescrud.repository.MatchRepository;
import com.example.matchescrud.repository.PlayerRepository;
import com.example.matchescrud.service.interfaces.IMatchPlayerStatsService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MatchPlayerStatsServiceImp implements IMatchPlayerStatsService {

    private final MatchPlayerStatsRepository matchPlayerStatsRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final MatchPlayerStatsMapper matchPlayerStatsMapper;

    public MatchPlayerStatsServiceImp(MatchPlayerStatsRepository matchPlayerStatsRepository,
                                      MatchRepository matchRepository,
                                      PlayerRepository playerRepository,
                                      MatchPlayerStatsMapper matchPlayerStatsMapper) {
        this.matchPlayerStatsRepository = matchPlayerStatsRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
        this.matchPlayerStatsMapper = matchPlayerStatsMapper;
    }

    @Override
    @Transactional
    public MatchPlayerStatsDTO addPlayerStats(UUID matchUuid, Long playerId, MatchPlayerStatsDTO statsDTO) throws ApiException {
        // Validate match exists
        Match match = matchRepository.findById(matchUuid)
                .orElseThrow(() -> new MatchNotFoundException(matchUuid));

        // Validate player exists
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        // Check if stats already exist for this player in this match
        Optional<MatchPlayerStats> existingStats = matchPlayerStatsRepository.findByMatchUuidAndPlayerId(matchUuid, playerId);
        if (existingStats.isPresent()) {
            throw new PlayerStatsAlreadyExist("Statistics already exist for player " + player.getName() + " in this match. Use update instead.");
        }

        // Verify player belongs to one of the teams in the match
        if (match.getHomeTeam() == null || match.getAwayTeam() == null || player.getTeam() == null) {
            throw new ApiException("Match teams or player team information is missing", org.springframework.http.HttpStatus.BAD_REQUEST);
        }
        if (!match.getHomeTeam().getId().equals(player.getTeam().getId()) &&
            !match.getAwayTeam().getId().equals(player.getTeam().getId())) {
            throw new ApiException("Player does not belong to either team in this match", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        // Create new stats
        MatchPlayerStats stats = new MatchPlayerStats();
        stats.setMatch(match);
        stats.setPlayer(player);
        stats.setGoals(statsDTO.getGoals());
        stats.setAssists(statsDTO.getAssists());
        stats.setPasses(statsDTO.getPasses());
        stats.setSaves(statsDTO.getSaves());

        MatchPlayerStats savedStats = matchPlayerStatsRepository.save(stats);
        return matchPlayerStatsMapper.matchPlayerStatsToDTO(savedStats);
    }

    @Override
    @Transactional
    public MatchPlayerStatsDTO updatePlayerStats(UUID matchUuid, Long playerId, MatchPlayerStatsDTO statsDTO) throws ApiException {
        // Validate match exists
        Match match = matchRepository.findById(matchUuid)
                .orElseThrow(() -> new MatchNotFoundException(matchUuid));

        // Validate player exists
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        // Find existing stats
        MatchPlayerStats stats = matchPlayerStatsRepository.findByMatchUuidAndPlayerId(matchUuid, playerId)
                .orElseThrow(() -> new ApiException("Statistics not found for player " + player.getName() + " in this match", org.springframework.http.HttpStatus.NOT_FOUND));

        // Update stats
        stats.setGoals(statsDTO.getGoals());
        stats.setAssists(statsDTO.getAssists());
        stats.setPasses(statsDTO.getPasses());
        stats.setSaves(statsDTO.getSaves());

        MatchPlayerStats updatedStats = matchPlayerStatsRepository.save(stats);
        return matchPlayerStatsMapper.matchPlayerStatsToDTO(updatedStats);
    }

    @Override
    @Transactional
    public void deletePlayerStats(UUID matchUuid, Long playerId) throws ApiException {
        // Validate match exists
        matchRepository.findById(matchUuid)
                .orElseThrow(() -> new MatchNotFoundException(matchUuid));

        // Validate player exists
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        // Find existing stats
        MatchPlayerStats stats = matchPlayerStatsRepository.findByMatchUuidAndPlayerId(matchUuid, playerId)
                .orElseThrow(() -> new ApiException("Statistics not found for player " + player.getName() + " in this match", org.springframework.http.HttpStatus.NOT_FOUND));

        // Delete stats
        matchPlayerStatsRepository.delete(stats);
    }

    @Override
    @Transactional
    public List<MatchPlayerStatsDTO> getMatchStats(UUID matchUuid) throws ApiException {
        // Validate match exists
        Match match = matchRepository.findById(matchUuid)
                .orElseThrow(() -> new MatchNotFoundException(matchUuid));

        List<MatchPlayerStats> statsList = matchPlayerStatsRepository.findByMatchUuid(matchUuid);
        return matchPlayerStatsMapper.matchPlayerStatsListToDTOList(statsList);
    }

    @Override
    @Transactional
    public MatchPlayerStatsDTO getPlayerStatsForMatch(UUID matchUuid, Long playerId) throws ApiException {
        // Validate match exists
        matchRepository.findById(matchUuid)
                .orElseThrow(() -> new MatchNotFoundException(matchUuid));

        // Validate player exists
        playerRepository.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        MatchPlayerStats stats = matchPlayerStatsRepository.findByMatchUuidAndPlayerId(matchUuid, playerId)
                .orElseThrow(() -> new ApiException("Statistics not found for this player in this match", org.springframework.http.HttpStatus.NOT_FOUND));

        return matchPlayerStatsMapper.matchPlayerStatsToDTO(stats);
    }
}

