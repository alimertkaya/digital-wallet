package com.alimertkaya.digitalwallet.auth.service.impl;

import com.alimertkaya.digitalwallet.auth.dto.AuthResponse;
import com.alimertkaya.digitalwallet.auth.dto.LoginRequest;
import com.alimertkaya.digitalwallet.auth.dto.RegisterRequest;
import com.alimertkaya.digitalwallet.shared.dto.enums.VerificationType;
import com.alimertkaya.digitalwallet.user.entity.User;
import com.alimertkaya.digitalwallet.user.repository.UserRepository;
import com.alimertkaya.digitalwallet.shared.config.AppConstants;
import com.alimertkaya.digitalwallet.auth.service.AuthService;
import com.alimertkaya.digitalwallet.shared.encryption.EncryptionService;
import com.alimertkaya.digitalwallet.shared.security.JwtService;
import com.alimertkaya.digitalwallet.auth.service.RefreshTokenService;
import com.alimertkaya.digitalwallet.notification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationService verificationService;
    private final EncryptionService encryptionService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.auth.max-failed-attempts:5}")
    private int maxFailedAttempts;

    private <T> Mono<Void> failIfPresent(Mono<T> mono, String message) {
        return mono
                .flatMap(x -> Mono.<Void>error(new ResponseStatusException(HttpStatus.BAD_REQUEST, message)))
                .switchIfEmpty(Mono.empty());
    }

    @Override
    public Mono<AuthResponse> register(RegisterRequest request) {
        String encryptedTckn = encryptionService.encrypt(request.getTckn());

        Mono<Void> validation = failIfPresent(userRepository.findByUsername(request.getUsername()),
                "Kullanıcı adı zaten alınmış: " + request.getUsername())
                .then(failIfPresent(userRepository.findByEmail(request.getEmail()),
                        "E-posta zaten kullanımda: " + request.getEmail()))
                .then(failIfPresent(userRepository.findByTckn(encryptedTckn),
                        "TCKN zaten kayıtlı"))
                .then(failIfPresent(userRepository.findByPhoneNumber(request.getPhoneNumber()),
                        "Telefon numarası zaten kayıtlı"));

        return validation.then(Mono.defer(() -> {
            User newUser = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .phoneNumber(request.getPhoneNumber())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .birthDate(request.getBirthDate())
                    .tckn(encryptedTckn)
                    .roles(AppConstants.DEFAULT_ROLE)
                    .isEnabled(true)
                    .isLocked(false)
                    .isEmailVerified(false)
                    .isPhoneVerified(false)
                    .failedLoginAttempts(0)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            return userRepository.save(newUser)
                    .flatMap(savedUser ->
                            verificationService.sendCode(savedUser.getId(), savedUser.getPhoneNumber(), VerificationType.PHONE_VERIFICATION)
                                    .thenReturn(savedUser))
                    .flatMap(savedUser -> refreshTokenService.createRefreshToken(savedUser.getId())
                            .map(refreshToken -> AuthResponse.builder()
                                    .token(jwtService.generateToken(savedUser))
                                    .refreshToken(refreshToken)
                                    .username(savedUser.getUsername())
                                    .build()));
        }));
    }

    @Override
    public Mono<AuthResponse> login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Kullanıcı bulunamadı veya şifre hatalı")))
                .flatMap(user -> {
                    if (user.isLocked()) {
                        return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                "Hesabınız kilitlenmiştir. Lütfen destek ile iletişime geçin."));
                    }

                    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        int attempts = user.getFailedLoginAttempts() + 1;
                        boolean shouldLock = attempts >= maxFailedAttempts;
                        user.setFailedLoginAttempts(attempts);
                        user.setLocked(shouldLock);
                        user.setUpdatedAt(LocalDateTime.now());

                        return userRepository.save(user).flatMap(saved -> {
                            if (shouldLock) {
                                log.warn("Hesap kilitlendi: {} ({} başarısız giriş)", user.getUsername(), attempts);
                                return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                        "Çok fazla başarısız giriş. Hesabınız kilitlendi."));
                            }
                            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                    String.format("Kullanıcı bulunamadı veya şifre hatalı. Kalan deneme: %d",
                                            maxFailedAttempts - attempts)));
                        });
                    }

                    // Başarılı giriş — sayacı sıfırla
                    user.setFailedLoginAttempts(0);
                    user.setUpdatedAt(LocalDateTime.now());

                    return userRepository.save(user)
                            .flatMap(saved -> refreshTokenService.createRefreshToken(saved.getId())
                                    .map(refreshToken -> AuthResponse.builder()
                                            .token(jwtService.generateToken(saved))
                                            .refreshToken(refreshToken)
                                            .username(saved.getUsername())
                                            .firstName(saved.getFirstName())
                                            .build()));
                });
    }

    @Override
    public Mono<AuthResponse> refreshToken(String refreshToken) {
        return refreshTokenService.validateAndRotate(refreshToken)
                .flatMap(rt -> userRepository.findById(rt.getUserId())
                        .switchIfEmpty(Mono.error(new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED, "Kullanıcı bulunamadı"))))
                .flatMap(user -> refreshTokenService.createRefreshToken(user.getId())
                        .map(newRefreshToken -> AuthResponse.builder()
                                .token(jwtService.generateToken(user))
                                .refreshToken(newRefreshToken)
                                .username(user.getUsername())
                                .firstName(user.getFirstName())
                                .build()));
    }
}
