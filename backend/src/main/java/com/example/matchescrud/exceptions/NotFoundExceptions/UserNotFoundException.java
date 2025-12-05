package com.example.matchescrud.exceptions.NotFoundExceptions;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException(String identifier) {
        super("User not found: " + identifier, HttpStatus.NOT_FOUND);
    }
}

