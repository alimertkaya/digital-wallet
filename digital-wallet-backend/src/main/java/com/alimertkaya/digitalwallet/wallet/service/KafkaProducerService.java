package com.alimertkaya.digitalwallet.wallet.service;

import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import reactor.core.publisher.Mono;

public interface KafkaProducerService {

    /* TransactionEvent i Kafka ya asenkron olarak gonderir
    * @param event gonderilecek islem
    * @return islemin tamamlandigini haber veren bir Mono<Void>
    */
    Mono<Void> sendTransactionEvent(TransactionEvent event);
}
