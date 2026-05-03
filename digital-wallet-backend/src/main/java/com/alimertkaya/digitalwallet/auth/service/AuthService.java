package com.alimertkaya.digitalwallet.auth.service;

import com.alimertkaya.digitalwallet.auth.dto.AuthResponse;
import com.alimertkaya.digitalwallet.auth.dto.LoginRequest;
import com.alimertkaya.digitalwallet.auth.dto.RegisterRequest;
import reactor.core.publisher.Mono;

public interface AuthService {

    // yeni kullaniciyi kaydetme
    // @param request kayit bilgileri (username, password. email etc.) iceren DTO
    // return JWT token iceren AuthResponse
    Mono<AuthResponse> register(RegisterRequest request);

    // @param request giris bilgileri iceren DTO
    // @return JWT token iceren AuthResponse
    Mono<AuthResponse> login(LoginRequest request);

    Mono<AuthResponse> refreshToken(String refreshToken);
}