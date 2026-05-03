package com.alimertkaya.digitalwallet.auth.service.impl;

import com.alimertkaya.digitalwallet.auth.entity.RefreshToken;
import com.alimertkaya.digitalwallet.auth.repository.RefreshTokenRepository;
import com.alimertkaya.digitalwallet.auth.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${app.auth.refresh-token-expiry-days:7}")
    private int refreshTokenExpiryDays;

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public Mono<String> createRefreshToken(Long userId) {
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpiryDays))
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .build();
        return refreshTokenRepository.save(refreshToken).map(RefreshToken::getToken);
    }

    @Override
    public Mono<RefreshToken> validateAndRotate(String token) {
        return refreshTokenRepository.findByToken(token)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Geçersiz refresh token")))
                .flatMap(rt -> {
                    if (rt.isRevoked()) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED, "Refresh token iptal edilmiş"));
                    }
                    if (rt.getExpiresAt().isBefore(LocalDateTime.now())) {
                        return Mono.error(new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED, "Refresh token süresi dolmuş"));
                    }
                    rt.setRevoked(true);
                    return refreshTokenRepository.save(rt);
                });
    }

    @Override
    public Mono<Void> revokeAllByUserId(Long userId) {
        return refreshTokenRepository.deleteAllByUserId(userId);
    }
}
