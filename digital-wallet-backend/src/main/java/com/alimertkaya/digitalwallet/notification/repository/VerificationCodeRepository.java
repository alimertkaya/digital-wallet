package com.alimertkaya.digitalwallet.notification.repository;

import com.alimertkaya.digitalwallet.shared.dto.enums.VerificationType;
import com.alimertkaya.digitalwallet.notification.entity.VerificationCode;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface VerificationCodeRepository extends R2dbcRepository<VerificationCode, Long> {
    Mono<VerificationCode> findByUserIdAndType(Long userId, VerificationType type);
}
