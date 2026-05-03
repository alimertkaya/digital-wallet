package com.alimertkaya.digitalwallet.notification.service.impl;

import com.alimertkaya.digitalwallet.shared.config.AppConstants;
import com.alimertkaya.digitalwallet.shared.dto.enums.VerificationType;
import com.alimertkaya.digitalwallet.notification.entity.VerificationCode;
import com.alimertkaya.digitalwallet.notification.repository.VerificationCodeRepository;
import com.alimertkaya.digitalwallet.notification.service.NotificationSenderService;
import com.alimertkaya.digitalwallet.notification.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationServiceImpl implements VerificationService {

    private final VerificationCodeRepository codeRepository;
    private final NotificationSenderService notificationSenderService;

    private static final SecureRandom secureRandom = new SecureRandom();

    @Override
    public Mono<Void> sendCode(Long userId, String destination, VerificationType type) {
        String code = String.format("%0" + AppConstants.VERIFICATION_CODE_LENGTH + "d",
                secureRandom.nextInt((int) Math.pow(10, AppConstants.VERIFICATION_CODE_LENGTH)));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(AppConstants.VERIFICATION_CODE_TTL_MINUTES);

        return codeRepository.findByUserIdAndType(userId, type)
                .flatMap(existing -> {
                    existing.setCode(code);
                    existing.setExpiryDate(expiry);
                    return codeRepository.save(existing);
                })
                .switchIfEmpty(Mono.defer(() -> codeRepository.save(VerificationCode.builder()
                        .userId(userId)
                        .code(code)
                        .type(type)
                        .expiryDate(expiry)
                        .build())))
                .flatMap(saved -> {
                    String message = "Doğrulama kodunuz: " + code;
                    if (type == VerificationType.EMAIL_VERIFICATION) {
                        return notificationSenderService.sendEmail(destination, "Dijital Cüzdan — E-posta Doğrulama", message);
                    }
                    return notificationSenderService.sendSms(destination, message);
                });
    }

    @Override
    public Mono<Boolean> verifyCode(Long userId, String inputCode, VerificationType type) {
        return codeRepository.findByUserIdAndType(userId, type)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz veya hatalı kod.")))
                .flatMap(vc -> {
                    if (vc.getExpiryDate().isBefore(LocalDateTime.now())) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kodun süresi dolmuş."));
                    }
                    if (!vc.getCode().equals(inputCode)) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hatalı kod."));
                    }
                    return codeRepository.delete(vc).thenReturn(true);
                });
    }
}
