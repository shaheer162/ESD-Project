package com.example.matchescrud.service.interfaces;

import com.example.matchescrud.dto.*;
import com.example.matchescrud.exceptions.ApiException;

import java.util.List;

public interface IStatisticsService {
    List<LeagueStandingsDTO> getLeagueStandingsByDivision(Long divisionId) throws ApiException;
    List<LeagueStandingsDTO> getAllLeagueStandings();
    List<TopScorerDTO> getTopScorers(int limit);
    List<TopAssistsDTO> getTopAssists(int limit);
    List<TeamPerformanceDTO> getTeamPerformanceOverTime(Long teamId) throws ApiException;
    List<StadiumStatsDTO> getStadiumStatistics();
}

