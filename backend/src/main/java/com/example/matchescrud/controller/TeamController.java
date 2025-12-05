package com.example.matchescrud.controller;

import com.example.matchescrud.dto.TeamDashboardDTO;
import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.TeamLoginDTO;
import com.example.matchescrud.dto.TeamMatchHistoryDTO;
import com.example.matchescrud.dto.TeamRegisterDTO;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.service.AuthorizationService;
import com.example.matchescrud.service.TeamServiceImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TeamController {

    //Dependency inyection
    TeamServiceImp teamServiceImp;
    private final AuthorizationService authorizationService;
    
    public TeamController(TeamServiceImp teamServiceImp, AuthorizationService authorizationService){
        this.teamServiceImp = teamServiceImp;
        this.authorizationService = authorizationService;
    }


    //Get all teams from DB - Admin only
    @GetMapping("/team")
    public ResponseEntity<List<TeamDTO>> getAll(
            @RequestHeader(value = "X-Admin-Username", required = false) String adminUsername) throws ApiException {
        authorizationService.requireAdmin(adminUsername);
        return new ResponseEntity<>(teamServiceImp.getAllTeams(), HttpStatus.OK);
    }

    //Get teams by their ID
    @GetMapping("/team/{id}")
    public ResponseEntity<TeamDTO> getTeam(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(teamServiceImp.getTeamById(id), HttpStatus.OK);
    }

    //Get teams from an specific city id
    @GetMapping("/teamByCity/{id}")
    public ResponseEntity<List<TeamDTO>> getTeamByCity(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(teamServiceImp.getTeamsByCityId(id), HttpStatus.OK);
    }

    //Get team match history
    @GetMapping("/team/{id}/history")
    public ResponseEntity<List<TeamMatchHistoryDTO>> getTeamHistory(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(teamServiceImp.getTeamMatchHistory(id), HttpStatus.OK);
    }

    //Get team dashboard
    @GetMapping("/team/{id}/dashboard")
    public ResponseEntity<TeamDashboardDTO> getTeamDashboard(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(teamServiceImp.getTeamDashboard(id), HttpStatus.OK);
    }

    //Update team
    @PutMapping("/team/{id}")
    public ResponseEntity<?> updateTeamById(@Valid @PathVariable Long id, @RequestBody TeamDTO teamDTO) throws ApiException{
        return new ResponseEntity<>(teamServiceImp.updateTeamById(id, teamDTO), HttpStatus.OK);
    }

    //Delete team
    @DeleteMapping("/team/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(teamServiceImp.deleteTeamById(id), HttpStatus.OK);
    }

    //Create team
    @PostMapping("/team")
    public ResponseEntity<?> createTeam(@Valid @RequestBody TeamDTO teamDTO) throws ApiException{
        return new ResponseEntity<>(teamServiceImp.createTeam(teamDTO), HttpStatus.CREATED);
    }

    //Register team with credentials
    @PostMapping("/team/register")
    public ResponseEntity<?> registerTeam(@RequestBody TeamRegisterDTO teamRegisterDTO) throws ApiException{
        return new ResponseEntity<>(teamServiceImp.registerTeam(teamRegisterDTO), HttpStatus.CREATED);
    }

    //Login team
    @PostMapping("/team/login")
    public ResponseEntity<?> loginTeam(@Valid @RequestBody TeamLoginDTO teamLoginDTO) throws ApiException{
        return new ResponseEntity<>(teamServiceImp.loginTeam(teamLoginDTO), HttpStatus.OK);
    }
}

