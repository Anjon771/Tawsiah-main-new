package com.basira.tawsiah.DTO.Request;


import java.util.List;

import com.basira.tawsiah.Model.valueObjects.Location;

import lombok.Data;


@Data
public class InterestRequestDTO {

    private Long userId;
    private List<String> interests;
    private Location location;


    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getInterests() {
        return this.interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}