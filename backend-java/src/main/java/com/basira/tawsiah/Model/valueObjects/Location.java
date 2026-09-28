package com.basira.tawsiah.Model.valueObjects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

//This class should be a helper-class for both of Event and Place files
@Embeddable
@Data
public class Location {

    @Column(nullable = false, columnDefinition = "float8 default 0")
    private Double latitude = 0.0;

    @Column(nullable = false, columnDefinition = "float8 default 0")
    private Double longitude = 0.0;

    @Column(nullable = true)
    private String addressDetails;

    // ADD no-arg constructor — required for Jackson
    public Location() {
        this.latitude = 0.0;
        this.longitude = 0.0;
    }

    public Location(Double latitude, Double longitude, String addressDetails) {
        this.latitude = latitude != null ? latitude : 0.0;
        this.longitude = longitude != null ? longitude : 0.0;
        this.addressDetails = addressDetails;
    }

    public Double getLatitude() {
        return this.latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return this.longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddressDetails() {
        return this.addressDetails;
    }

    public void setAddressDetails(String addressDetails) {
        this.addressDetails = addressDetails;
    }

}
