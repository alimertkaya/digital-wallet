package com.alimertkaya.digitalwallet.auth.service;

import com.alimertkaya.digitalwallet.auth.entity.RefreshToken;
import reactor.core.publisher.Mono;

public interface RefreshTokenService {

    Mono<String> createRefreshToken(Long userId);

    Mono<RefreshToken> validateAndRotate(String token);

    Mono<Void> revokeAllByUserId(Long userId);
}
