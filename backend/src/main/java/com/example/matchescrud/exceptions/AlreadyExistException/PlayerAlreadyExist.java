package com.example.matchescrud.exceptions.AlreadyExistException;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class PlayerAlreadyExist extends ApiException {
    public PlayerAlreadyExist(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}

