package com.alimertkaya.digitalwallet.wallet.repository;

import com.alimertkaya.digitalwallet.wallet.entity.OutboxEvent;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface OutboxEventRepository extends ReactiveCrudRepository<OutboxEvent, Long> {

    Flux<OutboxEvent> findByPublishedFalseOrderByCreatedAtAsc();
}
