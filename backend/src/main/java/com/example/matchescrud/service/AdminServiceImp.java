package com.example.matchescrud.service;

import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.UserDTO;
import com.example.matchescrud.exceptions.AlreadyExistException.UserAlreadyExist;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.UnauthorizedException;
import com.example.matchescrud.exceptions.NotFoundExceptions.UserNotFoundException;
import com.example.matchescrud.model.entity.User;
import com.example.matchescrud.repository.UserRepository;
import com.example.matchescrud.service.interfaces.IAdminService;
import com.example.matchescrud.service.interfaces.ITeamService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImp implements IAdminService {

    private final UserRepository userRepository;
    private final ITeamService teamService;

    public AdminServiceImp(UserRepository userRepository, ITeamService teamService) {
        this.userRepository = userRepository;
        this.teamService = teamService;
    }

    @Override
    @Transactional
    public UserDTO registerAdmin(UserDTO userDTO) throws ApiException {
        // Validate input
        if (userDTO.getUsername() == null || userDTO.getUsername().trim().isEmpty()) {
            throw new UserAlreadyExist("username", "Username is required");
        }
        
        if (userDTO.getUsername().trim().length() < 3) {
            throw new UserAlreadyExist("username", "Username must be at least 3 characters");
        }
        
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            throw new UserAlreadyExist("email", "Email is required");
        }
        
        if (!userDTO.getEmail().trim().contains("@")) {
            throw new UserAlreadyExist("email", "Invalid email format");
        }
        
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            throw new UserAlreadyExist("password", "Password is required");
        }
        
        if (userDTO.getPassword().length() < 6) {
            throw new UserAlreadyExist("password", "Password must be at least 6 characters");
        }

        String username = userDTO.getUsername().trim();
        String email = userDTO.getEmail().trim().toLowerCase();

        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExist("username", username);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExist("email", email);
        }

        // Set role to ADMIN
        User user = new User();
        user.setUsername(username);
        user.setPassword(userDTO.getPassword()); // In production, hash this with BCrypt
        user.setEmail(email);
        user.setRole(User.Role.ADMIN);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    @Override
    public UserDTO login(UserDTO userDTO) throws ApiException {
        User user = userRepository.findByUsername(userDTO.getUsername())
                .orElseThrow(() -> new UserNotFoundException("username: " + userDTO.getUsername()));

        // Simple password check (in production, use BCrypt password encoder)
        if (!user.getPassword().equals(userDTO.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        // Check if user is admin
        if (user.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Access denied. Admin role required.");
        }

        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> getAllAdmins() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.ADMIN)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeamDTO deleteTeam(Long id) throws ApiException {
        // Admin can delete teams
        return teamService.deleteTeamById(id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        // Don't return password in DTO
        return dto;
    }
}

