package com.basira.tawsiah.Model.valueObjects;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class Schedule {

    // Allow null values — frontend sends null when fields are empty
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in format YYYY-MM-DD")
    @Nullable
    private String date;

    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Time must be in format HH:mm")
    @Nullable
    private String startAt;

    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Time must be in format HH:mm")
    @Nullable
    private String endAt;

    // ADD no-arg constructor
    public Schedule() {
    }

    public Schedule(String date, String startAt, String endAt) {
        this.date = date;
        this.startAt = startAt;
        this.endAt = endAt;
    }

    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartAt() {
        return this.startAt;
    }

    public void setStartAt(String startAt) {
        this.startAt = startAt;
    }

    public String getEndAt() {
        return this.endAt;
    }

    public void setEndAt(String endAt) {
        this.endAt = endAt;
    }

}
