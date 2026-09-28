package com.basira.tawsiah.DTO;

public class InterestDTO {

    private Long id;
    private String name;
    private String type;
    private String icon;

    // Constructors
    public InterestDTO() {}

    public InterestDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public InterestDTO(Long id, String name, String type, String icon) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.icon = icon;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

}