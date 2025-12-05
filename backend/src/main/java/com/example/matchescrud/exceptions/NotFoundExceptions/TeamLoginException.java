package com.example.matchescrud.exceptions.NotFoundExceptions;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class TeamLoginException extends ApiException {
    public TeamLoginException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

