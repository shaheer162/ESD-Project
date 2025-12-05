package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.request.MatchRequestDTO;
import com.example.matchescrud.model.entity.Match;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MatchRequestMapper {

    public Match matchRequestDTOtoMatch(MatchRequestDTO matchRequestDTO) {
        if (matchRequestDTO == null) {
            return null;
        }
        
        Match match = new Match();
        match.setSpectators(matchRequestDTO.getSpectators());
        match.setDate(matchRequestDTO.getDate());
        match.setTime(matchRequestDTO.getTime());
        match.setHomeTeam(matchRequestDTO.getHomeTeam());
        match.setAwayTeam(matchRequestDTO.getAwayTeam());
        match.setHomeGoals(matchRequestDTO.getHomeGoals());
        match.setAwayGoals(matchRequestDTO.getAwayGoals());
        // Note: ticketPrice from DTO is used in service to calculate revenue
        // revenue and uuid are set by the service
        
        return match;
    }

    public MatchRequestDTO matchToMatchRequestDTO(Match match) {
        if (match == null) {
            return null;
        }
        
        MatchRequestDTO matchRequestDTO = new MatchRequestDTO();
        matchRequestDTO.setSpectators(match.getSpectators());
        matchRequestDTO.setDate(match.getDate());
        matchRequestDTO.setTime(match.getTime());
        matchRequestDTO.setHomeTeam(match.getHomeTeam());
        matchRequestDTO.setAwayTeam(match.getAwayTeam());
        matchRequestDTO.setHomeGoals(match.getHomeGoals());
        matchRequestDTO.setAwayGoals(match.getAwayGoals());
        // Note: ticketPrice cannot be derived from Match, would need to be calculated from revenue/spectators
        
        return matchRequestDTO;
    }

    public List<MatchRequestDTO> matchListToMatchRequestDTOList(List<Match> matches) {
        if (matches == null) {
            return null;
        }
        return matches.stream()
                .map(this::matchToMatchRequestDTO)
                .collect(Collectors.toList());
    }
}
