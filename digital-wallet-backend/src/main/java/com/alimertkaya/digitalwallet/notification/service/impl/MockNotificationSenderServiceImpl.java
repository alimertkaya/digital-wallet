package com.alimertkaya.digitalwallet.notification.service.impl;

import com.alimertkaya.digitalwallet.notification.service.NotificationSenderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@Profile({"dev", "test"})
@Slf4j
public class MockNotificationSenderServiceImpl implements NotificationSenderService {

    @Override
    public Mono<Void> sendSms(String phoneNumber, String message) {
        log.info("[MOCK SMS] Alıcı: {}, Mesaj: {}", phoneNumber, message);
        return Mono.empty();
    }

    @Override
    public Mono<Void> sendEmail(String email, String subject, String body) {
        log.info("[MOCK EMAIL] Alıcı: {}, Konu: {}, İçerik: {}", email, subject, body);
        return Mono.empty();
    }
}
