package com.alimertkaya.digitalwallet.shared.security.impl;

import com.alimertkaya.digitalwallet.shared.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

    private static final String KEY_PREFIX = "blacklist:token:";

    private final ReactiveStringRedisTemplate redisTemplate;

    @Override
    public Mono<Void> blacklist(String token, Duration ttl) {
        String key = KEY_PREFIX + token;
        return redisTemplate.opsForValue()
                .set(key, "1", ttl)
                .then();
    }

    @Override
    public Mono<Boolean> isBlacklisted(String token) {
        return redisTemplate.hasKey(KEY_PREFIX + token);
    }
}
