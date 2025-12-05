package com.example.matchescrud.controller;

import com.example.matchescrud.dto.*;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.service.StatisticsServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/statistics")
@CrossOrigin("http://localhost:4200")
public class StatisticsController {

    private final StatisticsServiceImp statisticsService;

    public StatisticsController(StatisticsServiceImp statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/standings/division/{divisionId}")
    public ResponseEntity<List<LeagueStandingsDTO>> getLeagueStandingsByDivision(@PathVariable Long divisionId) throws ApiException {
        return new ResponseEntity<>(statisticsService.getLeagueStandingsByDivision(divisionId), HttpStatus.OK);
    }

    @GetMapping("/standings/all")
    public ResponseEntity<List<LeagueStandingsDTO>> getAllLeagueStandings() {
        return new ResponseEntity<>(statisticsService.getAllLeagueStandings(), HttpStatus.OK);
    }

    @GetMapping("/top-scorers")
    public ResponseEntity<List<TopScorerDTO>> getTopScorers(@RequestParam(defaultValue = "10") int limit) {
        return new ResponseEntity<>(statisticsService.getTopScorers(limit), HttpStatus.OK);
    }

    @GetMapping("/top-assists")
    public ResponseEntity<List<TopAssistsDTO>> getTopAssists(@RequestParam(defaultValue = "10") int limit) {
        return new ResponseEntity<>(statisticsService.getTopAssists(limit), HttpStatus.OK);
    }

    @GetMapping("/team/{teamId}/performance")
    public ResponseEntity<List<TeamPerformanceDTO>> getTeamPerformanceOverTime(@PathVariable Long teamId) throws ApiException {
        return new ResponseEntity<>(statisticsService.getTeamPerformanceOverTime(teamId), HttpStatus.OK);
    }

    @GetMapping("/stadiums")
    public ResponseEntity<List<StadiumStatsDTO>> getStadiumStatistics() {
        return new ResponseEntity<>(statisticsService.getStadiumStatistics(), HttpStatus.OK);
    }
}

