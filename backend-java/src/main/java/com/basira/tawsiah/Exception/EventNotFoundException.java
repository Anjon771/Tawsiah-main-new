package com.basira.tawsiah.Exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(Long id){
        super("Event not found with this ID: "+id);
    }
}
