package com.alimertkaya.digitalwallet.wallet.repository;

import com.alimertkaya.digitalwallet.wallet.entity.TransactionHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface TransactionHistoryRepository extends R2dbcRepository<TransactionHistory, Long> {
    Flux<TransactionHistory> findByWalletId(Long walletId, Pageable pageable);
    Flux<TransactionHistory> findByWalletIdIn(List<Long> walletIds);
    Flux<TransactionHistory> findByWalletIdInAndCreatedAtAfter(List<Long> walletIds, LocalDateTime date);

    @Query("SELECT COALESCE(SUM(amount), 0) FROM transaction_history " +
           "WHERE wallet_id = :walletId AND type IN ('WITHDRAW', 'TRANSFER') " +
           "AND direction = 'OUT' AND created_at >= :since")
    Mono<BigDecimal> sumOutgoingAmountSince(Long walletId, LocalDateTime since);
}
