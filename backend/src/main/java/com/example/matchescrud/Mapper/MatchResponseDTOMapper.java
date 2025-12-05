package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.TeamReferenceDTO;
import com.example.matchescrud.dto.response.MatchResponseDTO;
import com.example.matchescrud.model.entity.Match;
import com.example.matchescrud.model.entity.Team;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MatchResponseDTOMapper {
    private final StadiumMapper stadiumMapper;

    public MatchResponseDTOMapper(StadiumMapper stadiumMapper) {
        this.stadiumMapper = stadiumMapper;
    }

    public MatchResponseDTO matchToMatchResponseDTO(Match match) {
        if (match == null) {
            return null;
        }
        
        MatchResponseDTO matchResponseDTO = new MatchResponseDTO();
        matchResponseDTO.setUuid(match.getUuid());
        if (match.getStadium() != null) {
            matchResponseDTO.setStadium(stadiumMapper.stadiumToStadiumDTO(match.getStadium()));
        }
        matchResponseDTO.setDate(match.getDate());
        matchResponseDTO.setTime(match.getTime());
        
        // Convert Team entities to TeamReferenceDTO to avoid circular references
        Team homeTeam = match.getHomeTeam();
        if (homeTeam != null) {
            TeamReferenceDTO homeTeamRef = new TeamReferenceDTO();
            homeTeamRef.setId(homeTeam.getId());
            homeTeamRef.setName(homeTeam.getName());
            matchResponseDTO.setHomeTeam(homeTeamRef);
        } else {
            matchResponseDTO.setHomeTeam(new TeamReferenceDTO());
        }
        
        Team awayTeam = match.getAwayTeam();
        if (awayTeam != null) {
            TeamReferenceDTO awayTeamRef = new TeamReferenceDTO();
            awayTeamRef.setId(awayTeam.getId());
            awayTeamRef.setName(awayTeam.getName());
            matchResponseDTO.setAwayTeam(awayTeamRef);
        } else {
            matchResponseDTO.setAwayTeam(new TeamReferenceDTO());
        }
        
        matchResponseDTO.setHomeGoals(match.getHomeGoals());
        matchResponseDTO.setAwayGoals(match.getAwayGoals());
        matchResponseDTO.setSpectators(match.getSpectators());
        matchResponseDTO.setRevenue(match.getRevenue());
        
        return matchResponseDTO;
    }

    public Match matchResponseDTOToMatch(MatchResponseDTO matchResponseDTO) {
        if (matchResponseDTO == null) {
            return null;
        }
        
        Match match = new Match();
        match.setUuid(matchResponseDTO.getUuid());
        if (matchResponseDTO.getStadium() != null) {
            match.setStadium(stadiumMapper.stadiumDTOToStadium(matchResponseDTO.getStadium()));
        }
        match.setDate(matchResponseDTO.getDate());
        match.setTime(matchResponseDTO.getTime());
        // Note: homeTeam and awayTeam cannot be set from DTO as they require full Team entities
        // This method may not be used in practice
        match.setHomeGoals(matchResponseDTO.getHomeGoals());
        match.setAwayGoals(matchResponseDTO.getAwayGoals());
        match.setSpectators(matchResponseDTO.getSpectators());
        match.setRevenue(matchResponseDTO.getRevenue());
        
        return match;
    }

    public List<MatchResponseDTO> matchListToMatchResponseDTOList(List<Match> matchList) {
        if (matchList == null) {
            return null;
        }
        return matchList.stream()
                .map(this::matchToMatchResponseDTO)
                .collect(Collectors.toList());
    }
}
