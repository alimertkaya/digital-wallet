package com.alimertkaya.digitalwallet.wallet.service.impl;

import com.alimertkaya.digitalwallet.shared.config.KafkaTopicConfig;
import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import com.alimertkaya.digitalwallet.wallet.service.DeadLetterService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class DeadLetterServiceImpl implements DeadLetterService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> send(TransactionEvent event, String reason) {
        return Mono.fromCallable(() -> {
            Map<String, Object> payload = Map.of(
                    "event", event,
                    "reason", reason,
                    "failedAt", java.time.LocalDateTime.now().toString()
            );
            return objectMapper.writeValueAsString(payload);
        })
        .flatMap(json -> Mono.fromFuture(
                kafkaTemplate.send(KafkaTopicConfig.WALLET_TRANSACTIONS_DLT,
                        String.valueOf(event.getSourceWalletId()), json)
        ))
        .subscribeOn(Schedulers.boundedElastic())
        .doOnSuccess(r -> log.warn("DLT'ye yönlendirildi. EventId: {}, Sebep: {}", event.getEventId(), reason))
        .doOnError(e -> log.error("DLT'ye gönderilemedi! EventId: {}", event.getEventId(), e))
        .then();
    }
}
