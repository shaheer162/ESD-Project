package com.example.matchescrud.exceptions.AlreadyExistException;

import com.example.matchescrud.exceptions.ApiException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExist extends ApiException {
    public UserAlreadyExist(String field, String value) {
        super("User with " + field + ": " + value + " already exists", HttpStatus.CONFLICT);
    }
}

