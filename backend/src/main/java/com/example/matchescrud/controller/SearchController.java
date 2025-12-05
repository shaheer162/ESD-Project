package com.example.matchescrud.controller;

import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.response.MatchResponseDTO;
import com.example.matchescrud.service.SearchServiceImp;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@CrossOrigin("http://localhost:4200")
public class SearchController {

    private final SearchServiceImp searchService;

    public SearchController(SearchServiceImp searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/teams")
    public ResponseEntity<List<TeamDTO>> searchTeams(@RequestParam(required = false) String q) {
        return new ResponseEntity<>(searchService.searchTeams(q), HttpStatus.OK);
    }

    @GetMapping("/players")
    public ResponseEntity<List<PlayerDTO>> searchPlayers(@RequestParam(required = false) String q) {
        return new ResponseEntity<>(searchService.searchPlayers(q), HttpStatus.OK);
    }

    @GetMapping("/players/filter")
    public ResponseEntity<List<PlayerDTO>> filterPlayers(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Integer minJersey,
            @RequestParam(required = false) Integer maxJersey) {
        return new ResponseEntity<>(searchService.filterPlayers(teamId, position, minJersey, maxJersey), HttpStatus.OK);
    }

    @GetMapping("/matches/filter")
    public ResponseEntity<List<MatchResponseDTO>> filterMatches(
            @RequestParam(required = false) Long divisionId,
            @RequestParam(required = false) Long stadiumId,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return new ResponseEntity<>(searchService.filterMatches(divisionId, stadiumId, teamId, startDate, endDate), HttpStatus.OK);
    }
}

