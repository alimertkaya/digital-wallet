package com.alimertkaya.digitalwallet.shared.config.filter;

import com.alimertkaya.digitalwallet.shared.security.JwtService;
import com.alimertkaya.digitalwallet.shared.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter implements WebFilter {

    public static final String HEADER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final ReactiveUserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith(HEADER_PREFIX)) {
            return chain.filter(exchange);
        }

        String token = authHeader.substring(HEADER_PREFIX.length());

        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            log.warn("JWT token okunamadı: {}", e.getMessage());
            return chain.filter(exchange);
        }

        if (username == null || username.isBlank()) {
            return chain.filter(exchange);
        }

        return tokenBlacklistService.isBlacklisted(token)
                .flatMap(blacklisted -> {
                    if (blacklisted) {
                        log.warn("Blacklist'teki token kullanılmaya çalışıldı. Kullanıcı: {}", username);
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }
                    return userDetailsService.findByUsername(username)
                            .flatMap(user -> {
                                if (!jwtService.isTokenValid(token, user)) {
                                    return chain.filter(exchange);
                                }
                                var authentication = new UsernamePasswordAuthenticationToken(
                                        user, null, user.getAuthorities());
                                var context = new SecurityContextImpl(authentication);
                                return chain.filter(exchange)
                                        .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(context)));
                            })
                            .onErrorResume(ex -> {
                                log.debug("UserDetailsService hatası: {}", ex.getMessage());
                                return chain.filter(exchange);
                            });
                });
    }
}
