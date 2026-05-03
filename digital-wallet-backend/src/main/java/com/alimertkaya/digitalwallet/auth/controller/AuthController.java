package com.alimertkaya.digitalwallet.auth.controller;

import com.alimertkaya.digitalwallet.auth.dto.AuthResponse;
import com.alimertkaya.digitalwallet.auth.dto.LoginRequest;
import com.alimertkaya.digitalwallet.auth.dto.RefreshTokenRequest;
import com.alimertkaya.digitalwallet.auth.dto.RegisterRequest;
import com.alimertkaya.digitalwallet.auth.service.AuthService;
import com.alimertkaya.digitalwallet.shared.security.JwtService;
import com.alimertkaya.digitalwallet.shared.security.TokenBlacklistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request).map(ResponseEntity::ok);
    }

    @PostMapping("/refresh")
    public Mono<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request.getRefreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.substring(7);
        return tokenBlacklistService.blacklist(token, jwtService.getRemainingTtl(token));
    }
}
