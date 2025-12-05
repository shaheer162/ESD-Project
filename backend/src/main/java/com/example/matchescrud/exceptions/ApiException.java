package com.example.matchescrud.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

public class ApiException extends Exception{
    private final String message;
    private final HttpStatus httpStatuscode;
    
    public ApiException(String message, HttpStatus httpStatuscode) {
        super(message);
        this.message = message;
        this.httpStatuscode = httpStatuscode;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatuscode() {
        return httpStatuscode;
    }
}