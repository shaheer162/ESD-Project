package com.example.matchescrud.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(RestResponseEntityExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    protected ResponseEntity<Object> handleApiException(ApiException ex, WebRequest request) {
        logger.warn("API Exception: {}", ex.getMessage(), ex);
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("status", ex.getHttpStatuscode().value());
        body.put("error", ex.getHttpStatuscode().getReasonPhrase());
        body.put("exception", ex.getClass().getSimpleName());
        
        return new ResponseEntity<>(body, ex.getHttpStatuscode());
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleGenericException(Exception ex, WebRequest request) {
        logger.error("Unexpected error occurred", ex);
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        
        // Include exception class name for debugging
        body.put("exception", ex.getClass().getSimpleName());
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}