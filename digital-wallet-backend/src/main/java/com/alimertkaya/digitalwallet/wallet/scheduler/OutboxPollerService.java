package com.alimertkaya.digitalwallet.wallet.scheduler;

import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import com.alimertkaya.digitalwallet.wallet.entity.OutboxEvent;
import com.alimertkaya.digitalwallet.wallet.repository.OutboxEventRepository;
import com.alimertkaya.digitalwallet.wallet.service.KafkaProducerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxPollerService {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaProducerService kafkaProducerService;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelayString = "${app.outbox.poll-interval-ms:5000}")
    public void pollAndPublish() {
        outboxEventRepository.findByPublishedFalseOrderByCreatedAtAsc()
                .flatMap(this::publishAndMarkDone)
                .doOnError(e -> log.error("Outbox polling hatası: {}", e.getMessage(), e))
                .onErrorContinue((e, obj) -> log.warn("Event yayımlanamadı, bir sonraki döngüde tekrar denenir: {}", obj))
                .subscribe();
    }

    private reactor.core.publisher.Mono<OutboxEvent> publishAndMarkDone(OutboxEvent outboxEvent) {
        return deserializeEvent(outboxEvent)
                .flatMap(kafkaProducerService::sendTransactionEvent)
                .then(markPublished(outboxEvent))
                .doOnSuccess(saved -> log.info("Outbox event Kafka'ya gönderildi. ID: {}, Type: {}",
                        outboxEvent.getId(), outboxEvent.getEventType()));
    }

    private reactor.core.publisher.Mono<TransactionEvent> deserializeEvent(OutboxEvent outboxEvent) {
        return reactor.core.publisher.Mono.fromCallable(() -> {
            try {
                return objectMapper.readValue(outboxEvent.getPayload(), TransactionEvent.class);
            } catch (Exception e) {
                throw new RuntimeException("Outbox event deserializasyon hatası. ID: " + outboxEvent.getId(), e);
            }
        });
    }

    private reactor.core.publisher.Mono<OutboxEvent> markPublished(OutboxEvent outboxEvent) {
        outboxEvent.setPublished(true);
        outboxEvent.setPublishedAt(LocalDateTime.now());
        return outboxEventRepository.save(outboxEvent);
    }
}
