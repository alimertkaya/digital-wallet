package com.alimertkaya.digitalwallet.shared.security;

import reactor.core.publisher.Mono;

import java.time.Duration;

public interface TokenBlacklistService {
    Mono<Void> blacklist(String token, Duration ttl);
    Mono<Boolean> isBlacklisted(String token);
}
