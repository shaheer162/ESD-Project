package com.example.matchescrud.service.interfaces;

import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.TeamDashboardDTO;
import com.example.matchescrud.dto.TeamLoginDTO;
import com.example.matchescrud.dto.TeamMatchHistoryDTO;
import com.example.matchescrud.dto.TeamRegisterDTO;
import com.example.matchescrud.exceptions.ApiException;

import java.util.List;

public interface ITeamService {

    //Get
    TeamDTO getTeamById(Long id)throws ApiException;
    List<TeamDTO> getAllTeams();
    List<TeamDTO> getTeamsByCityId(Long id)throws ApiException;
    List<TeamMatchHistoryDTO> getTeamMatchHistory(Long teamId) throws ApiException;
    TeamDashboardDTO getTeamDashboard(Long teamId) throws ApiException;

    //Post
    TeamDTO createTeam(TeamDTO teamDTO) throws ApiException;
    TeamDTO registerTeam(TeamRegisterDTO teamRegisterDTO) throws ApiException;
    TeamDTO loginTeam(TeamLoginDTO teamLoginDTO) throws ApiException;

    //Put
   TeamDTO updateTeamById(Long id, TeamDTO teamDTO) throws ApiException;

    //Delete
    TeamDTO deleteTeamById(Long id) throws ApiException;
}
