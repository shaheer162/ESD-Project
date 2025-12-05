package com.example.matchescrud.service;

import com.example.matchescrud.exceptions.UnauthorizedException;
import com.example.matchescrud.model.entity.User;
import com.example.matchescrud.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    
    private final UserRepository userRepository;
    
    public AuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Check if a user is an administrator
     * @param username The username to check
     * @return true if user is admin, false otherwise
     */
    public boolean isAdmin(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        
        return userRepository.findByUsername(username.trim())
                .map(user -> user.getRole() == User.Role.ADMIN)
                .orElse(false);
    }
    
    /**
     * Verify that the user is an administrator, throw exception if not
     * @param username The username to verify
     * @throws UnauthorizedException if user is not an admin
     */
    public void requireAdmin(String username) throws UnauthorizedException {
        if (!isAdmin(username)) {
            throw new UnauthorizedException("Access denied. Administrator privileges required.");
        }
    }
}

