package com.example.matchescrud.service;

import com.example.matchescrud.Mapper.PlayerMapper;
import com.example.matchescrud.Mapper.TeamMapper;
import com.example.matchescrud.Mapper.MatchResponseDTOMapper;
import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.response.MatchResponseDTO;
import com.example.matchescrud.model.entity.Match;
import com.example.matchescrud.model.entity.Player;
import com.example.matchescrud.model.entity.Team;
import com.example.matchescrud.repository.MatchRepository;
import com.example.matchescrud.repository.PlayerRepository;
import com.example.matchescrud.repository.TeamRepository;
import com.example.matchescrud.service.interfaces.ISearchService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImp implements ISearchService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final TeamMapper teamMapper;
    private final PlayerMapper playerMapper;
    private final MatchResponseDTOMapper matchResponseDTOMapper;

    public SearchServiceImp(TeamRepository teamRepository, PlayerRepository playerRepository,
                           MatchRepository matchRepository, TeamMapper teamMapper,
                           PlayerMapper playerMapper, MatchResponseDTOMapper matchResponseDTOMapper) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.teamMapper = teamMapper;
        this.playerMapper = playerMapper;
        this.matchResponseDTOMapper = matchResponseDTOMapper;
    }

    @Override
    public List<TeamDTO> searchTeams(String query) {
        List<Team> teams = teamRepository.findAll();
        if (query == null || query.trim().isEmpty()) {
            return teamMapper.teamListToTeamDTOList(teams);
        }
        String lowerQuery = query.toLowerCase();
        return teams.stream()
                .filter(team -> (team.getName() != null && team.getName().toLowerCase().contains(lowerQuery)) ||
                               (team.getUsername() != null && team.getUsername().toLowerCase().contains(lowerQuery)))
                .map(teamMapper::teamToTeamDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> searchPlayers(String query) {
        List<Player> players = playerRepository.findAll();
        if (query == null || query.trim().isEmpty()) {
            return playerMapper.playerListToPlayerDTOList(players);
        }
        String lowerQuery = query.toLowerCase();
        return players.stream()
                .filter(player -> (player.getName() != null && player.getName().toLowerCase().contains(lowerQuery)) ||
                                 (player.getPosition() != null && player.getPosition().toLowerCase().contains(lowerQuery)))
                .map(playerMapper::playerToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> filterPlayers(Long teamId, String position, Integer minJersey, Integer maxJersey) {
        List<Player> players = playerRepository.findAll();
        
        return players.stream()
                .filter(player -> {
                    if (teamId != null && (player.getTeam() == null || !player.getTeam().getId().equals(teamId))) {
                        return false;
                    }
                    if (position != null && !position.trim().isEmpty() && 
                        (player.getPosition() == null || !player.getPosition().equalsIgnoreCase(position))) {
                        return false;
                    }
                    if (minJersey != null && player.getJerseyNumber() < minJersey) {
                        return false;
                    }
                    if (maxJersey != null && player.getJerseyNumber() > maxJersey) {
                        return false;
                    }
                    return true;
                })
                .map(playerMapper::playerToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchResponseDTO> filterMatches(Long divisionId, Long stadiumId, Long teamId, LocalDate startDate, LocalDate endDate) {
        List<Match> matches = matchRepository.findAll();
        
        return matches.stream()
                .filter(match -> {
                    if (divisionId != null) {
                        boolean divisionMatch = (match.getHomeTeam() != null && match.getHomeTeam().getDivision() != null && 
                                               match.getHomeTeam().getDivision().getId().equals(divisionId)) ||
                                              (match.getAwayTeam() != null && match.getAwayTeam().getDivision() != null && 
                                               match.getAwayTeam().getDivision().getId().equals(divisionId));
                        if (!divisionMatch) return false;
                    }
                    if (stadiumId != null && (match.getStadium() == null || !match.getStadium().getId().equals(stadiumId))) {
                        return false;
                    }
                    if (teamId != null) {
                        boolean teamMatch = (match.getHomeTeam() != null && match.getHomeTeam().getId().equals(teamId)) ||
                                          (match.getAwayTeam() != null && match.getAwayTeam().getId().equals(teamId));
                        if (!teamMatch) return false;
                    }
                    if (startDate != null && match.getDate().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && match.getDate().isAfter(endDate)) {
                        return false;
                    }
                    return true;
                })
                .map(matchResponseDTOMapper::matchToMatchResponseDTO)
                .collect(Collectors.toList());
    }
}

