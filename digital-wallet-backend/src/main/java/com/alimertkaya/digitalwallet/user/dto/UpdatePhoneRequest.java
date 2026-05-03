package com.alimertkaya.digitalwallet.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdatePhoneRequest {
    @NotBlank(message = "Telefon numarası boş bırakılamaz")
    @Pattern(regexp = "^(\\+90|0)?[0-9]{10}$", message = "Geçerli bir Türkiye telefon numarası giriniz (örn: 05321234567)")
    private String newPhoneNumber;
}