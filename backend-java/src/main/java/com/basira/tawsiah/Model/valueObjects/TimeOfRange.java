package com.basira.tawsiah.Model.valueObjects;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class TimeOfRange {


    @Column(nullable = false)
    private LocalTime OpenTime;

    @Column(nullable = false)
    private LocalTime CloseTime; 

    public TimeOfRange(LocalTime OpenTime, LocalTime CloseTime) {
        this.OpenTime = OpenTime;
        this.CloseTime = CloseTime;
    }

    public LocalTime getOpenTime() {
        return this.OpenTime;
    }

    public void setOpenTime(LocalTime OpenTime) {
        this.OpenTime = OpenTime;
    }

    public LocalTime getCloseTime() {
        return this.CloseTime;
    }

    public void setCloseTime(LocalTime CloseTime) {
        this.CloseTime = CloseTime;
    }


}
