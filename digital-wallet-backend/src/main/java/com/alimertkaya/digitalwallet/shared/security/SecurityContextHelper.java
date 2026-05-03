package com.alimertkaya.digitalwallet.shared.security;

import com.alimertkaya.digitalwallet.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Component
public class SecurityContextHelper {

    public Mono<User> getCurrentUser() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(auth -> {
                    if (auth.getPrincipal() instanceof User user) {
                        return Mono.just(user);
                    }
                    return Mono.error(new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "Kullanıcı oturumu bulunamadı."));
                });
    }

    public Mono<Long> getCurrentUserId() {
        return getCurrentUser().map(User::getId);
    }
}
