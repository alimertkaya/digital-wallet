package com.alimertkaya.digitalwallet.service;

import com.alimertkaya.digitalwallet.auth.dto.LoginRequest;
import com.alimertkaya.digitalwallet.auth.dto.RegisterRequest;
import com.alimertkaya.digitalwallet.auth.service.impl.AuthServiceImpl;
import com.alimertkaya.digitalwallet.auth.service.RefreshTokenService;
import com.alimertkaya.digitalwallet.notification.service.VerificationService;
import com.alimertkaya.digitalwallet.shared.dto.enums.VerificationType;
import com.alimertkaya.digitalwallet.shared.encryption.EncryptionService;
import com.alimertkaya.digitalwallet.shared.security.JwtService;
import com.alimertkaya.digitalwallet.user.entity.User;
import com.alimertkaya.digitalwallet.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock VerificationService verificationService;
    @Mock EncryptionService encryptionService;
    @Mock RefreshTokenService refreshTokenService;

    @InjectMocks AuthServiceImpl authService;

    @Test
    void register_shouldReturnToken_whenAllFieldsUnique() {
        RegisterRequest request = RegisterRequest.builder()
                .username("newuser").password("pass1234").email("new@test.com")
                .phoneNumber("05321234567").firstName("Ali").lastName("Test")
                .birthDate(LocalDate.of(1990, 1, 1)).tckn("12345678901")
                .build();

        when(encryptionService.encrypt("12345678901")).thenReturn("encrypted-tckn");
        when(userRepository.findByUsername("newuser")).thenReturn(Mono.empty());
        when(userRepository.findByEmail("new@test.com")).thenReturn(Mono.empty());
        when(userRepository.findByTckn("encrypted-tckn")).thenReturn(Mono.empty());
        when(userRepository.findByPhoneNumber("05321234567")).thenReturn(Mono.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed-pass");
        when(userRepository.save(any())).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u = User.builder().id(1L).username(u.getUsername()).email(u.getEmail())
                    .password(u.getPassword()).tckn(u.getTckn()).roles("ROLE_USER")
                    .isEnabled(true).isLocked(false)
                    .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
            return Mono.just(u);
        });
        when(verificationService.sendCode(any(), any(), eq(VerificationType.PHONE_VERIFICATION)))
                .thenReturn(Mono.empty());
        when(jwtService.generateToken(any())).thenReturn("mock-token");
        when(refreshTokenService.createRefreshToken(any())).thenReturn(Mono.just("mock-refresh-token"));

        StepVerifier.create(authService.register(request))
                .expectNextMatches(response ->
                        response.getToken().equals("mock-token") &&
                        response.getUsername().equals("newuser"))
                .verifyComplete();

        verify(encryptionService).encrypt("12345678901");
    }

    @Test
    void register_shouldReturnBadRequest_whenUsernameAlreadyTaken() {
        RegisterRequest request = RegisterRequest.builder()
                .username("existing").password("pass1234").email("new@test.com")
                .phoneNumber("05321234567").firstName("Ali").lastName("Test")
                .birthDate(LocalDate.of(1990, 1, 1)).tckn("12345678901")
                .build();

        when(encryptionService.encrypt(anyString())).thenReturn("encrypted-tckn");
        when(userRepository.findByUsername("existing"))
                .thenReturn(Mono.just(User.builder().username("existing").build()));

        StepVerifier.create(authService.register(request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                })
                .verify();
    }

    @Test
    void login_shouldReturnToken_whenCredentialsValid() {
        LoginRequest request = new LoginRequest("testuser", "correctpass");

        User user = User.builder().id(1L).username("testuser")
                .password("hashed-pass").roles("ROLE_USER")
                .isEnabled(true).isLocked(false).failedLoginAttempts(0)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();

        when(userRepository.findByUsername("testuser")).thenReturn(Mono.just(user));
        when(passwordEncoder.matches("correctpass", "hashed-pass")).thenReturn(true);
        when(userRepository.save(any())).thenReturn(Mono.just(user));
        when(jwtService.generateToken(any())).thenReturn("mock-token");
        when(refreshTokenService.createRefreshToken(any())).thenReturn(Mono.just("mock-refresh-token"));

        StepVerifier.create(authService.login(request))
                .expectNextMatches(response -> response.getToken().equals("mock-token"))
                .verifyComplete();
    }

    @Test
    void login_shouldReturnUnauthorized_whenPasswordWrong() {
        LoginRequest request = new LoginRequest("testuser", "wrongpass");

        User user = User.builder().id(1L).username("testuser")
                .password("hashed-pass").roles("ROLE_USER")
                .isEnabled(true).isLocked(false).failedLoginAttempts(0)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();

        when(userRepository.findByUsername("testuser")).thenReturn(Mono.just(user));
        when(passwordEncoder.matches("wrongpass", "hashed-pass")).thenReturn(false);
        when(userRepository.save(any())).thenReturn(Mono.just(user));

        StepVerifier.create(authService.login(request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                })
                .verify();
    }

    @Test
    void login_shouldReturnUnauthorized_whenUserNotFound() {
        LoginRequest request = new LoginRequest("nouser", "pass");
        when(userRepository.findByUsername("nouser")).thenReturn(Mono.empty());

        StepVerifier.create(authService.login(request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                })
                .verify();
    }
}
