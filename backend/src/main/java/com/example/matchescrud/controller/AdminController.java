package com.example.matchescrud.controller;

import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.UserDTO;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.service.interfaces.IAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }

    // Register new administrator
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody UserDTO userDTO) throws ApiException {
        return new ResponseEntity<>(adminService.registerAdmin(userDTO), HttpStatus.CREATED);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) throws ApiException {
        return new ResponseEntity<>(adminService.login(userDTO), HttpStatus.OK);
    }

    // Get all administrators
    @GetMapping("/admins")
    public ResponseEntity<List<UserDTO>> getAllAdmins() {
        return new ResponseEntity<>(adminService.getAllAdmins(), HttpStatus.OK);
    }

    // Protected endpoint - only admins can delete teams
    @DeleteMapping("/team/{id}")
    public ResponseEntity<?> deleteTeamAsAdmin(@PathVariable Long id) throws ApiException {
        return new ResponseEntity<>(adminService.deleteTeam(id), HttpStatus.OK);
    }
}

