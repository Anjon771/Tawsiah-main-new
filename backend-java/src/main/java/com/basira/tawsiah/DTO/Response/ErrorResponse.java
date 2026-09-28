package com.basira.tawsiah.DTO.Response;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private int status;
    private List<String> errors;

    public ErrorResponse(int status, List<String> errors) {
        this.status = status;
        this.errors = errors;
    }

    public ErrorResponse(int value, String message, LocalDateTime now) {
        this.status = value;
        this.errors = List.of(message);
    }

    public int getStatus() { return status; }
    public List<String> getErrors() { return errors; }
}