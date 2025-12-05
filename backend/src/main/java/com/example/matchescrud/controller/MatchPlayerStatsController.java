package com.example.matchescrud.controller;

import com.example.matchescrud.dto.MatchPlayerStatsDTO;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.service.AuthorizationService;
import com.example.matchescrud.service.MatchPlayerStatsServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/match")
@CrossOrigin("http://localhost:4200")
public class MatchPlayerStatsController {
    private final MatchPlayerStatsServiceImp matchPlayerStatsService;
    private final AuthorizationService authorizationService;

    public MatchPlayerStatsController(MatchPlayerStatsServiceImp matchPlayerStatsService, AuthorizationService authorizationService) {
        this.matchPlayerStatsService = matchPlayerStatsService;
        this.authorizationService = authorizationService;
    }

    @PostMapping("/{matchUuid}/player/{playerId}/stats")
    public ResponseEntity<MatchPlayerStatsDTO> addPlayerStats(
            @PathVariable UUID matchUuid,
            @PathVariable Long playerId,
            @RequestBody MatchPlayerStatsDTO statsDTO,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        return new ResponseEntity<>(
            matchPlayerStatsService.addPlayerStats(matchUuid, playerId, statsDTO),
            HttpStatus.CREATED
        );
    }

    @PutMapping("/{matchUuid}/player/{playerId}/stats")
    public ResponseEntity<MatchPlayerStatsDTO> updatePlayerStats(
            @PathVariable UUID matchUuid,
            @PathVariable Long playerId,
            @RequestBody MatchPlayerStatsDTO statsDTO,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        return new ResponseEntity<>(
            matchPlayerStatsService.updatePlayerStats(matchUuid, playerId, statsDTO),
            HttpStatus.OK
        );
    }

    @GetMapping("/{matchUuid}/stats")
    public ResponseEntity<List<MatchPlayerStatsDTO>> getMatchStats(@PathVariable UUID matchUuid) throws ApiException {
        return new ResponseEntity<>(
            matchPlayerStatsService.getMatchStats(matchUuid),
            HttpStatus.OK
        );
    }

    @GetMapping("/{matchUuid}/player/{playerId}/stats")
    public ResponseEntity<MatchPlayerStatsDTO> getPlayerStatsForMatch(
            @PathVariable UUID matchUuid,
            @PathVariable Long playerId) throws ApiException {
        return new ResponseEntity<>(
            matchPlayerStatsService.getPlayerStatsForMatch(matchUuid, playerId),
            HttpStatus.OK
        );
    }

    @DeleteMapping("/{matchUuid}/player/{playerId}/stats")
    public ResponseEntity<?> deletePlayerStats(
            @PathVariable UUID matchUuid,
            @PathVariable Long playerId,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        matchPlayerStatsService.deletePlayerStats(matchUuid, playerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

