package com.alimertkaya.digitalwallet.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserInfoRequest {
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
}