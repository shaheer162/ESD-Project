package com.example.matchescrud.controller;


import com.example.matchescrud.dto.request.MatchRequestDTO;
import com.example.matchescrud.dto.response.MatchResponseDTO;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.UnauthorizedException;
import com.example.matchescrud.model.entity.User;
import com.example.matchescrud.repository.UserRepository;
import com.example.matchescrud.service.MatchServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin("http://localhost:4200")
public class MatchController {

    //Dependency injection
    MatchServiceImp matchServiceImp;
    UserRepository userRepository;
    
    public MatchController(MatchServiceImp matchServiceImp, UserRepository userRepository){
        this.matchServiceImp = matchServiceImp;
        this.userRepository = userRepository;
    }
    
    /**
     * Check if username is an admin
     */
    private void requireAdmin(String username) throws UnauthorizedException {
        if (username == null || username.trim().isEmpty()) {
            throw new UnauthorizedException("Admin username is required");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(username.trim());
        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Access denied. Administrator privileges required.");
        }
    }

    //Get all matches
    @GetMapping("/match")
    public ResponseEntity<List<MatchResponseDTO>> getAllMatches(){
        return new ResponseEntity<>(matchServiceImp.getAllMatches(), HttpStatus.OK);
    }

    //Get match by UUID
    @GetMapping("/match/{uuid}")
    public ResponseEntity<MatchResponseDTO> getMatchByUUID(@PathVariable UUID uuid) throws ApiException {
        return new ResponseEntity<>(matchServiceImp.getMatchByUUID(uuid), HttpStatus.OK);
    }


    //Delete match - Admin only
    @DeleteMapping("/match/{uuid}")
    public ResponseEntity<?> deleteMatch(
            @PathVariable UUID uuid,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        requireAdmin(adminUsername);
        return new ResponseEntity<>(matchServiceImp.deleteMatch(uuid), HttpStatus.OK);
    }

    //Create match - Admin only
    @PostMapping("/match")
    public ResponseEntity<?> createMatch(
            @Valid @RequestBody MatchRequestDTO matchRequestDTO,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        requireAdmin(adminUsername);
        return new ResponseEntity<>(matchServiceImp.createMatch(matchRequestDTO), HttpStatus.CREATED);
    }

    //Update match - Admin only
    @PutMapping("/match/{uuid}")
    public ResponseEntity<?> updateMatch(
            @PathVariable UUID uuid,
            @Valid @RequestBody MatchRequestDTO matchRequestDTO,
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        requireAdmin(adminUsername);
        return new ResponseEntity<>(matchServiceImp.updateMatch(uuid, matchRequestDTO), HttpStatus.OK);
    }
}
