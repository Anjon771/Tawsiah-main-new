package com.basira.tawsiah.Exception;

public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(Long userID){
        super("User " + userID + " does not exist!");
    }
}
