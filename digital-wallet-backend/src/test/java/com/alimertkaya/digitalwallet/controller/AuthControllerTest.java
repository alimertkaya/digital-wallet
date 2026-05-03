package com.alimertkaya.digitalwallet.auth.controller;

import com.alimertkaya.digitalwallet.auth.dto.AuthResponse;
import com.alimertkaya.digitalwallet.auth.service.AuthService;
import com.alimertkaya.digitalwallet.shared.security.JwtService;
import com.alimertkaya.digitalwallet.shared.security.TokenBlacklistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.time.Duration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebFluxTest(controllers = AuthController.class)
class AuthControllerTest {

    @Autowired WebTestClient webTestClient;

    @MockBean AuthService authService;
    @MockBean JwtService jwtService;
    @MockBean TokenBlacklistService tokenBlacklistService;
    @MockBean ReactiveUserDetailsService userDetailsService;

    private static final String REGISTER_BODY = """
            {
              "username": "testuser",
              "password": "pass1234",
              "email": "test@test.com",
              "phoneNumber": "05321234567",
              "firstName": "Ali",
              "lastName": "Test",
              "birthDate": "1990-01-01",
              "tckn": "12345678901"
            }
            """;

    @Test
    void register_shouldReturn201_whenRequestValid() {
        AuthResponse response = AuthResponse.builder()
                .token("mock-token").username("testuser").firstName("Ali").build();
        when(authService.register(any())).thenReturn(Mono.just(response));

        webTestClient.post().uri("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(REGISTER_BODY)
                .exchange()
                .expectStatus().isCreated()
                .expectBody()
                .jsonPath("$.token").isEqualTo("mock-token")
                .jsonPath("$.username").isEqualTo("testuser");
    }

    @Test
    void register_shouldReturn400_whenUsernameBlank() {
        webTestClient.post().uri("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"username\":\"\",\"password\":\"pass1234\"}")
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void login_shouldReturn200_whenCredentialsValid() {
        AuthResponse response = AuthResponse.builder()
                .token("mock-token").username("testuser").firstName("Ali").build();
        when(authService.login(any())).thenReturn(Mono.just(response));

        webTestClient.post().uri("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"username\":\"testuser\",\"password\":\"pass1234\"}")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.token").isEqualTo("mock-token");
    }

    @Test
    void login_shouldReturn401_whenCredentialsInvalid() {
        when(authService.login(any()))
                .thenReturn(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz kimlik bilgileri")));

        webTestClient.post().uri("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"username\":\"testuser\",\"password\":\"wrongpass\"}")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    @WithMockUser
    void logout_shouldReturn204_whenTokenValid() {
        when(jwtService.getRemainingTtl(anyString())).thenReturn(Duration.ofHours(1));
        when(tokenBlacklistService.blacklist(anyString(), any())).thenReturn(Mono.empty());

        webTestClient.post().uri("/api/v1/auth/logout")
                .header(HttpHeaders.AUTHORIZATION, "Bearer mock-token")
                .exchange()
                .expectStatus().isNoContent();

        verify(tokenBlacklistService).blacklist(anyString(), any());
    }
}
