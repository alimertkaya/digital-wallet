package com.alimertkaya.digitalwallet.wallet.service;

import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import reactor.core.publisher.Mono;

public interface DeadLetterService {
    Mono<Void> send(TransactionEvent event, String reason);
}
