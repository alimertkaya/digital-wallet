package com.alimertkaya.digitalwallet.wallet.service;

import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import reactor.core.publisher.Mono;

public interface OutboxService {

    Mono<Void> save(TransactionEvent event);
}
