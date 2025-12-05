package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.model.entity.Team;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TeamMapper {
    private final CityMapper cityMapper;
    private final StadiumMapper stadiumMapper;
    private final DivisionMapper divisionMapper;
    private final MatchResponseDTOMapper matchResponseDTOMapper;

    public TeamMapper(CityMapper cityMapper, StadiumMapper stadiumMapper, 
                     DivisionMapper divisionMapper, MatchResponseDTOMapper matchResponseDTOMapper) {
        this.cityMapper = cityMapper;
        this.stadiumMapper = stadiumMapper;
        this.divisionMapper = divisionMapper;
        this.matchResponseDTOMapper = matchResponseDTOMapper;
    }

    public TeamDTO teamToTeamDTO(Team team) {
        if (team == null) {
            return null;
        }
        
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId(team.getId());
        teamDTO.setName(team.getName());
        
        if (team.getDivision() != null) {
            teamDTO.setDivision(divisionMapper.divisionToDivisionDTO(team.getDivision()));
        }
        if (team.getCity() != null) {
            teamDTO.setCity(cityMapper.cityToCityDTO(team.getCity()));
        }
        if (team.getStadium() != null) {
            teamDTO.setStadium(stadiumMapper.stadiumToStadiumDTO(team.getStadium()));
        }
        // Don't load matches when converting to DTO to avoid performance issues and circular references
        // Matches should be loaded separately via match endpoints
        teamDTO.setHomeMatches(new ArrayList<>());
        teamDTO.setAwayMatches(new ArrayList<>());
        
        return teamDTO;
    }

    public Team teamDTOToTeam(TeamDTO teamDTO) {
        if (teamDTO == null) {
            return null;
        }
        
        Team team = new Team();
        team.setId(teamDTO.getId());
        team.setName(teamDTO.getName());
        
        // Note: Nested objects (division, city, stadium, matches) are typically handled
        // by services, so we don't map them here to avoid circular dependencies
        // This method may not be used in practice
        
        return team;
    }

    public List<TeamDTO> teamListToTeamDTOList(List<Team> teamList) {
        if (teamList == null) {
            return null;
        }
        return teamList.stream()
                .map(this::teamToTeamDTO)
                .collect(Collectors.toList());
    }
}
