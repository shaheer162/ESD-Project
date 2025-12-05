package com.example.matchescrud.exceptions.AlreadyExistException;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class TeamCredentialsAlreadyExist extends ApiException {
    public TeamCredentialsAlreadyExist(String field, String value) {
        super("Team with " + field + ": " + value + " already exists", HttpStatus.CONFLICT);
    }
}

