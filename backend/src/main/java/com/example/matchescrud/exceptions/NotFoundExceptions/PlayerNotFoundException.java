package com.example.matchescrud.exceptions.NotFoundExceptions;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class PlayerNotFoundException extends ApiException {
    public PlayerNotFoundException(Long id) {
        super("No player was found with id " + id, HttpStatus.NOT_FOUND);
    }
}

