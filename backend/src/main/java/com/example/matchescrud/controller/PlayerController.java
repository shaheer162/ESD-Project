package com.example.matchescrud.controller;

import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.dto.PlayerHistoryDTO;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.UnauthorizedException;
import com.example.matchescrud.service.AuthorizationService;
import com.example.matchescrud.service.PlayerServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("http://localhost:4200")
public class PlayerController {
    
    private final PlayerServiceImp playerServiceImp;
    private final AuthorizationService authorizationService;
    
    public PlayerController(PlayerServiceImp playerServiceImp, AuthorizationService authorizationService) {
        this.playerServiceImp = playerServiceImp;
        this.authorizationService = authorizationService;
    }
    
    @GetMapping("/player/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(playerServiceImp.getPlayerById(id), HttpStatus.OK);
    }
    
    @GetMapping("/team/{teamId}/players")
    public ResponseEntity<List<PlayerDTO>> getPlayersByTeam(@PathVariable Long teamId) throws ApiException {
        return new ResponseEntity<>(playerServiceImp.getPlayersByTeamId(teamId), HttpStatus.OK);
    }
    
    @GetMapping("/player/{id}/history")
    public ResponseEntity<List<PlayerHistoryDTO>> getPlayerHistory(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(playerServiceImp.getPlayerHistory(id), HttpStatus.OK);
    }
    
    @PostMapping("/player")
    public ResponseEntity<PlayerDTO> createPlayer(
            @Valid @RequestBody PlayerDTO playerDTO,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        return new ResponseEntity<>(playerServiceImp.createPlayer(playerDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/player/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(
            @Valid @PathVariable Long id,
            @RequestBody PlayerDTO playerDTO,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        return new ResponseEntity<>(playerServiceImp.updatePlayer(id, playerDTO), HttpStatus.OK);
    }
    
    @DeleteMapping("/player/{id}")
    public ResponseEntity<?> deletePlayer(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        playerServiceImp.deletePlayer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

