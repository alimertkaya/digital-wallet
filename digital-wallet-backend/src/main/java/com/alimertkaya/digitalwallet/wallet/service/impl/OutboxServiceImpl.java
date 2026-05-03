package com.alimertkaya.digitalwallet.wallet.service.impl;

import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import com.alimertkaya.digitalwallet.wallet.entity.OutboxEvent;
import com.alimertkaya.digitalwallet.wallet.repository.OutboxEventRepository;
import com.alimertkaya.digitalwallet.wallet.service.OutboxService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxServiceImpl implements OutboxService {

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> save(TransactionEvent event) {
        return Mono.fromCallable(() -> serializeEvent(event))
                .flatMap(payload -> {
                    OutboxEvent outboxEvent = OutboxEvent.builder()
                            .eventType(event.getType().name())
                            .payload(payload)
                            .published(false)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return outboxEventRepository.save(outboxEvent);
                })
                .doOnSuccess(saved -> log.debug("Outbox'a kaydedildi. EventId: {}, Type: {}",
                        event.getEventId(), event.getType()))
                .then();
    }

    private String serializeEvent(TransactionEvent event) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Outbox event serializasyon hatası: " + event.getEventId(), e);
        }
    }
}
