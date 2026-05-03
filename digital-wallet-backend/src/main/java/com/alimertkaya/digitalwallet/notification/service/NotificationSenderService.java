package com.alimertkaya.digitalwallet.notification.service;

import reactor.core.publisher.Mono;

public interface NotificationSenderService {
    Mono<Void> sendSms(String phoneNumber, String message);
    Mono<Void> sendEmail(String email, String subject, String body);
}
