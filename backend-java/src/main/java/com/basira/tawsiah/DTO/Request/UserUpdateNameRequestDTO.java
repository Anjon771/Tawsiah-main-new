package com.basira.tawsiah.DTO.Request;

public class UserUpdateNameRequestDTO {
    private String name;

    public UserUpdateNameRequestDTO() {}

    public UserUpdateNameRequestDTO(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
