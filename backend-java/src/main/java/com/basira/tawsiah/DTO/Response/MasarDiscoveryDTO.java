package com.basira.tawsiah.DTO.Response;

import java.util.List;

import lombok.Data;

@Data
public class MasarDiscoveryDTO {

    private List<String> categories;
    private List<String> cities;

    public MasarDiscoveryDTO() {
    }

    public MasarDiscoveryDTO(List<String> categories, List<String> cities) {
        this.categories = categories;
        this.cities = cities;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getCities() {
        return cities;
    }

    public void setCities(List<String> cities) {
        this.cities = cities;
    }
}
