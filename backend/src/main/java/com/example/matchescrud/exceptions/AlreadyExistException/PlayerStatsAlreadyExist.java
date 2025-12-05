package com.example.matchescrud.exceptions.AlreadyExistException;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class PlayerStatsAlreadyExist extends ApiException {
    public PlayerStatsAlreadyExist(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}

