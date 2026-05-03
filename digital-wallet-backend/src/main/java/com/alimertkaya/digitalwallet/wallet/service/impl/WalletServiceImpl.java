package com.alimertkaya.digitalwallet.wallet.service.impl;

import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionType;
import com.alimertkaya.digitalwallet.wallet.dto.*;
import com.alimertkaya.digitalwallet.wallet.entity.Wallet;
import com.alimertkaya.digitalwallet.wallet.repository.TransactionHistoryRepository;
import com.alimertkaya.digitalwallet.wallet.repository.WalletRepository;
import com.alimertkaya.digitalwallet.exchangerate.service.ExchangeRateService;
import com.alimertkaya.digitalwallet.wallet.service.OutboxService;
import com.alimertkaya.digitalwallet.shared.security.SecurityContextHelper;
import com.alimertkaya.digitalwallet.wallet.service.WalletService;
import io.micrometer.tracing.Tracer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final OutboxService outboxService;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final ExchangeRateService exchangeRateService;
    private final SecurityContextHelper securityContextHelper;

    @Autowired(required = false)
    private Tracer tracer;

    @Value("${app.wallet.daily-transaction-limit:10000}")
    private BigDecimal dailyTransactionLimit;

    private static final String WALLET_NOT_FOUND = "Cüzdan bulunamadı veya bu cüzdana erişim yetkiniz yok.";

    private Mono<Wallet> findOwnedWallet(Long walletId, Long userId) {
        return walletRepository.findByIdAndUserId(walletId, userId)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, WALLET_NOT_FOUND)));
    }

    private String currentTraceId() {
        if (tracer == null) return null;
        var span = tracer.currentSpan();
        return span != null ? span.context().traceId() : null;
    }

    private String currentSpanId() {
        if (tracer == null) return null;
        var span = tracer.currentSpan();
        return span != null ? span.context().spanId() : null;
    }

    private Mono<Void> checkDailyLimit(Long walletId, BigDecimal requestedAmount) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        return transactionHistoryRepository.sumOutgoingAmountSince(walletId, startOfDay)
                .defaultIfEmpty(BigDecimal.ZERO)
                .flatMap(dailyTotal -> {
                    if (dailyTotal.add(requestedAmount).compareTo(dailyTransactionLimit) > 0) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                String.format("Günlük işlem limitiniz aşıldı. Limit: %.2f, Bugün yapılan: %.2f",
                                        dailyTransactionLimit, dailyTotal)));
                    }
                    return Mono.empty();
                });
    }

    @Override
    public Mono<WalletResponse> createWallet(CreateWalletRequest request) {
        return securityContextHelper.getCurrentUser().flatMap(user -> {
            Wallet newWallet = Wallet.builder()
                    .userId(user.getId())
                    .name(request.getName())
                    .currencyCode(request.getCurrencyCode().toUpperCase())
                    .balance(BigDecimal.ZERO)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            return walletRepository.save(newWallet).map(WalletResponse::fromEntity);
        });
    }

    @Override
    public Flux<WalletResponse> getCurrentUserWallets(int page, int size) {
        return securityContextHelper.getCurrentUserId()
                .flatMapMany(userId -> walletRepository.findByUserIdPaged(userId, size, page * size))
                .map(WalletResponse::fromEntity);
    }

    @Override
    public Mono<WalletResponse> getWalletById(Long walletId) {
        return securityContextHelper.getCurrentUserId()
                .flatMap(userId -> findOwnedWallet(walletId, userId))
                .map(WalletResponse::fromEntity);
    }

    @Override
    public Mono<Void> depositToWallet(Long walletId, DepositRequest request) {
        return securityContextHelper.getCurrentUserId()
                .flatMap(userId -> findOwnedWallet(walletId, userId))
                .flatMap(wallet -> {
                    TransactionEvent event = TransactionEvent.builder()
                            .type(TransactionType.DEPOSIT)
                            .sourceWalletId(wallet.getId())
                            .sourceAmount(request.getAmount())
                            .targetAmount(request.getAmount())
                            .sourceCurrency(wallet.getCurrencyCode())
                            .targetCurrency(wallet.getCurrencyCode())
                            .traceId(currentTraceId())
                            .spanId(currentSpanId())
                            .build();

                    log.info("Para yatırma talebi outbox'a kaydediliyor. Cüzdan ID: {}, Tutar: {}", wallet.getId(), request.getAmount());
                    return outboxService.save(event);
                });
    }

    @Override
    public Mono<Void> transferFunds(Long sourceWalletId, TransferRequest request) {
        Mono<Wallet> sourceWalletMono = securityContextHelper.getCurrentUserId()
                .flatMap(userId -> findOwnedWallet(sourceWalletId, userId));

        Mono<Wallet> targetWalletMono = walletRepository.findById(request.getTargetWalletId())
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Hedef cüzdan bulunamadı.")));

        return Mono.zip(sourceWalletMono, targetWalletMono)
                .flatMap(tuple -> {
                    Wallet sourceWallet = tuple.getT1();
                    Wallet targetWallet = tuple.getT2();

                    if (sourceWallet.getBalance().compareTo(request.getAmount()) < 0) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yetersiz bakiye!"));
                    }
                    if (sourceWallet.getId().equals(targetWallet.getId())) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kendinize transfer yapamazsınız."));
                    }

                    return checkDailyLimit(sourceWallet.getId(), request.getAmount())
                            .then(exchangeRateService.convertCurrency(
                                    request.getAmount(),
                                    sourceWallet.getCurrencyCode(),
                                    targetWallet.getCurrencyCode()
                            ))
                            .flatMap(convertedAmount -> {
                                TransactionEvent event = TransactionEvent.builder()
                                        .type(TransactionType.TRANSFER)
                                        .sourceWalletId(sourceWallet.getId())
                                        .targetWalletId(targetWallet.getId())
                                        .sourceAmount(request.getAmount())
                                        .targetAmount(convertedAmount)
                                        .sourceCurrency(sourceWallet.getCurrencyCode())
                                        .targetCurrency(targetWallet.getCurrencyCode())
                                        .description(request.getDescription())
                                        .traceId(currentTraceId())
                                        .spanId(currentSpanId())
                                        .build();

                                log.info("Transfer talebi outbox'a kaydediliyor. {} -> {}, {} {} -> {} {}",
                                        sourceWallet.getId(), targetWallet.getId(),
                                        request.getAmount(), sourceWallet.getCurrencyCode(),
                                        convertedAmount, targetWallet.getCurrencyCode());

                                return outboxService.save(event);
                            });
                });
    }

    @Override
    public Mono<Void> withdrawFromWallet(Long walletId, WithdrawRequest request) {
        return securityContextHelper.getCurrentUserId()
                .flatMap(userId -> findOwnedWallet(walletId, userId))
                .flatMap(wallet -> {
                    if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Yetersiz bakiye! Mevcut: " + wallet.getBalance()));
                    }

                    return checkDailyLimit(wallet.getId(), request.getAmount())
                            .then(Mono.defer(() -> {
                                TransactionEvent event = TransactionEvent.builder()
                                        .type(TransactionType.WITHDRAW)
                                        .sourceWalletId(wallet.getId())
                                        .sourceAmount(request.getAmount())
                                        .targetAmount(request.getAmount())
                                        .sourceCurrency(wallet.getCurrencyCode())
                                        .targetCurrency(wallet.getCurrencyCode())
                                        .description(request.getDescription())
                                        .traceId(currentTraceId())
                                        .spanId(currentSpanId())
                                        .build();

                                log.info("Para çekme talebi outbox'a kaydediliyor. Cüzdan ID: {}, Tutar: {}", wallet.getId(), request.getAmount());
                                return outboxService.save(event);
                            }));
                });
    }

    @Override
    public Flux<TransactionHistoryResponse> getWalletTransactionHistory(Long walletId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return securityContextHelper.getCurrentUserId()
                .flatMapMany(userId ->
                        findOwnedWallet(walletId, userId)
                                .flatMapMany(wallet -> transactionHistoryRepository.findByWalletId(walletId, pageable)))
                .map(TransactionHistoryResponse::fromEntity);
    }

    @Override
    public Mono<Void> deleteWallet(Long walletId) {
        return securityContextHelper.getCurrentUserId()
                .flatMap(userId -> findOwnedWallet(walletId, userId))
                .flatMap(wallet -> {
                    if (wallet.getBalance().compareTo(BigDecimal.ZERO) > 0) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Bakiyesi olan cüzdan silinemez. Önce bakiyeyi çekin veya transfer edin."));
                    }
                    wallet.setDeleted(true);
                    wallet.setDeletedAt(LocalDateTime.now());
                    wallet.setUpdatedAt(LocalDateTime.now());
                    log.info("Cüzdan silindi (soft). ID: {}, Kullanıcı ID: {}", wallet.getId(), wallet.getUserId());
                    return walletRepository.save(wallet).then();
                });
    }
}
