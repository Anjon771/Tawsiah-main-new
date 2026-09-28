package com.basira.tawsiah.Exception;

import java.time.LocalDateTime;
import java.util.Map;
// Ewan:
// This class is used to structure the error response sent back to the client when an exception occurs
// It helps the frontend to understand what went wrong and display appropriate messages to the user
// that way we can have a consistent error response format across the application, making it easier to handle errors on the frontend
public class ErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> errors; // to hold field-specific validation errors (optional)

    // Constructors, Getters and Setters
    public ErrorResponse(int status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public ErrorResponse(int status, String message, LocalDateTime timestamp, Map<String, String> errors) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
        this.errors = errors;
    }

    public ErrorResponse() {
        
    }

    // getters and setters
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    
}
