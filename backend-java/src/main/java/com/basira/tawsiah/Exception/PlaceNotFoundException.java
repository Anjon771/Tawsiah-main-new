package com.basira.tawsiah.Exception;

public class PlaceNotFoundException extends RuntimeException{
    
    public PlaceNotFoundException(Long id){
        super("place not found with this ID :"+id);
    }
}
