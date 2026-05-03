package com.alimertkaya.digitalwallet.wallet.repository;

import com.alimertkaya.digitalwallet.wallet.entity.Wallet;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface WalletRepository extends R2dbcRepository<Wallet, Long> {

    @Query("SELECT * FROM wallets WHERE user_id = :userId AND is_deleted = false ORDER BY created_at DESC")
    Flux<Wallet> findByUserId(Long userId);

    @Query("SELECT * FROM wallets WHERE user_id = :userId AND is_deleted = false ORDER BY created_at DESC LIMIT :limit OFFSET :offset")
    Flux<Wallet> findByUserIdPaged(Long userId, int limit, int offset);

    @Query("SELECT * FROM wallets WHERE id = :id AND user_id = :userId AND is_deleted = false")
    Mono<Wallet> findByIdAndUserId(Long id, Long userId);
}
