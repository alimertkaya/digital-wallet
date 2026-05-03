package com.alimertkaya.digitalwallet.wallet.consumer;

import com.alimertkaya.digitalwallet.shared.config.AppConstants;
import com.alimertkaya.digitalwallet.shared.config.KafkaTopicConfig;
import com.alimertkaya.digitalwallet.shared.dto.enums.HistoryDirection;
import com.alimertkaya.digitalwallet.shared.dto.enums.NotificationType;
import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionCategory;
import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionType;
import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import com.alimertkaya.digitalwallet.wallet.entity.TransactionHistory;
import com.alimertkaya.digitalwallet.wallet.entity.Wallet;
import com.alimertkaya.digitalwallet.wallet.repository.TransactionHistoryRepository;
import com.alimertkaya.digitalwallet.wallet.repository.WalletRepository;
import com.alimertkaya.digitalwallet.wallet.service.DeadLetterService;
import com.alimertkaya.digitalwallet.wallet.service.TransactionCategoryService;
import com.alimertkaya.digitalwallet.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionConsumer {

    private final WalletRepository walletRepository;
    private final ObjectMapper objectMapper;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final NotificationService notificationService;
    private final TransactionCategoryService categoryService;
    private final DeadLetterService deadLetterService;

    @KafkaListener(topics = KafkaTopicConfig.WALLET_TRANSACTIONS_TOPIC, groupId = AppConstants.KAFKA_GROUP_ID)
    public void consumeTransactionEvent(String message) {
        log.info("Kafka'dan mesaj alındı: {}", message);

        TransactionEvent event;
        try {
            event = objectMapper.readValue(message, TransactionEvent.class);
        } catch (Exception e) {
            log.error("Mesaj parse edilemedi, DLT'ye gönderiliyor: {}", message, e);
            return;
        }

        Mono<Void> operation = switch (event.getType()) {
            case DEPOSIT  -> processDeposit(event);
            case WITHDRAW -> processWithdraw(event);
            case TRANSFER -> processTransfer(event);
            default -> {
                log.warn("Bilinmeyen işlem tipi: {}", event.getType());
                yield Mono.empty();
            }
        };

        operation
            .doOnError(e -> log.error("İşlem başarısız. EventId: {}, Tip: {}", event.getEventId(), event.getType(), e))
            .onErrorResume(e -> deadLetterService.send(event, e.getMessage()))
            .subscribe();
    }

    @Transactional
    public Mono<Void> processDeposit(TransactionEvent event) {
        log.info("Para yatırma işlemi başlatılıyor. Cüzdan ID: {}, Tutar: {} {}",
                event.getSourceWalletId(), event.getSourceAmount(), event.getSourceCurrency());

        return walletRepository.findById(event.getSourceWalletId())
                .switchIfEmpty(Mono.error(new IllegalArgumentException(
                        "Cüzdan bulunamadı: " + event.getSourceWalletId())))
                .flatMap(wallet -> {
                    BigDecimal balanceBefore = wallet.getBalance();
                    wallet.setBalance(wallet.getBalance().add(event.getTargetAmount()));
                    return walletRepository.save(wallet)
                            .flatMap(saved -> saveHistory(saved, TransactionType.DEPOSIT, HistoryDirection.IN,
                                    event.getSourceAmount(), event.getTargetAmount(),
                                    event.getSourceCurrency(), event.getTargetCurrency(),
                                    balanceBefore, null, "Para Yatırma", TransactionCategory.DEPOSIT))
                            .flatMap(history -> notificationService.createNotification(
                                    wallet.getUserId(),
                                    "Para Yatırma Başarılı",
                                    event.getSourceAmount() + " " + event.getSourceCurrency() + " hesabınıza yüklendi.",
                                    NotificationType.PAYMENT).then());
                })
                .doOnSuccess(v -> log.info("Para yatırma başarılı. Cüzdan: {}", event.getSourceWalletId()));
    }

    @Transactional
    public Mono<Void> processTransfer(TransactionEvent event) {
        log.info("Transfer işlemi başlatılıyor. {} -> {}, Tutar: {} {}",
                event.getSourceWalletId(), event.getTargetWalletId(),
                event.getSourceAmount(), event.getSourceCurrency());

        TransactionCategory category = event.getCategory() != null
                ? event.getCategory()
                : categoryService.categorize(TransactionType.TRANSFER, event.getDescription());

        return Mono.zip(
                walletRepository.findById(event.getSourceWalletId())
                        .switchIfEmpty(Mono.error(new IllegalArgumentException(
                                "Kaynak cüzdan bulunamadı: " + event.getSourceWalletId()))),
                walletRepository.findById(event.getTargetWalletId())
                        .switchIfEmpty(Mono.error(new IllegalArgumentException(
                                "Hedef cüzdan bulunamadı: " + event.getTargetWalletId())))
        ).flatMap(tuple -> {
            Wallet source = tuple.getT1();
            Wallet target = tuple.getT2();

            BigDecimal sourceBalanceBefore = source.getBalance();
            BigDecimal targetBalanceBefore = target.getBalance();

            source.setBalance(source.getBalance().subtract(event.getSourceAmount()));
            target.setBalance(target.getBalance().add(event.getTargetAmount()));

            return walletRepository.save(source)
                    .then(walletRepository.save(target))
                    .then(saveHistory(source, TransactionType.TRANSFER, HistoryDirection.OUT,
                            event.getSourceAmount(), event.getTargetAmount(),
                            event.getSourceCurrency(), event.getTargetCurrency(),
                            sourceBalanceBefore, event.getTargetWalletId(), event.getDescription(), category))
                    .then(saveHistory(target, TransactionType.TRANSFER, HistoryDirection.IN,
                            event.getSourceAmount(), event.getTargetAmount(),
                            event.getSourceCurrency(), event.getTargetCurrency(),
                            targetBalanceBefore, event.getSourceWalletId(), event.getDescription(), TransactionCategory.TRANSFER))
                    .then(notificationService.createNotification(source.getUserId(),
                            "Para Transferi",
                            "Hesabınızdan " + event.getSourceAmount() + " " + event.getSourceCurrency() + " gönderildi.",
                            NotificationType.TRANSFER_OUT))
                    .then(notificationService.createNotification(target.getUserId(),
                            "Para Transferi Aldınız",
                            "Hesabınıza " + event.getTargetAmount() + " " + event.getTargetCurrency() + " geldi.",
                            NotificationType.TRANSFER_IN))
                    .then();
        })
        .doOnSuccess(v -> log.info("Transfer başarıyla tamamlandı. {} -> {}", event.getSourceWalletId(), event.getTargetWalletId()));
    }

    @Transactional
    public Mono<Void> processWithdraw(TransactionEvent event) {
        log.info("Para çekme işlemi başlatılıyor. Cüzdan ID: {}, Tutar: {} {}",
                event.getSourceWalletId(), event.getSourceAmount(), event.getSourceCurrency());

        return walletRepository.findById(event.getSourceWalletId())
                .switchIfEmpty(Mono.error(new IllegalArgumentException(
                        "Cüzdan bulunamadı: " + event.getSourceWalletId())))
                .flatMap(wallet -> {
                    BigDecimal balanceBefore = wallet.getBalance();
                    wallet.setBalance(wallet.getBalance().subtract(event.getSourceAmount()));

                    TransactionCategory category = categoryService.categorize(
                            TransactionType.WITHDRAW, event.getDescription());

                    return walletRepository.save(wallet)
                            .flatMap(saved -> saveHistory(saved, TransactionType.WITHDRAW, HistoryDirection.OUT,
                                    event.getSourceAmount(), event.getTargetAmount(),
                                    event.getSourceCurrency(), event.getTargetCurrency(),
                                    balanceBefore, null, event.getDescription(), category))
                            .flatMap(history -> notificationService.createNotification(
                                    wallet.getUserId(),
                                    "Para Çekme İşlemi",
                                    "Hesabınızdan " + event.getSourceAmount() + " " + event.getSourceCurrency() + " çekildi.",
                                    NotificationType.PAYMENT).then());
                })
                .doOnSuccess(v -> log.info("Para çekme başarılı. Cüzdan: {}", event.getSourceWalletId()));
    }

    private Mono<TransactionHistory> saveHistory(Wallet wallet, TransactionType type, HistoryDirection direction,
                                                  BigDecimal sourceAmount, BigDecimal targetAmount,
                                                  String sourceCurrency, String targetCurrency,
                                                  BigDecimal balanceBefore, Long relatedWalletId,
                                                  String description, TransactionCategory category) {
        BigDecimal amount   = direction == HistoryDirection.OUT ? sourceAmount : targetAmount;
        String currency     = direction == HistoryDirection.OUT ? sourceCurrency : targetCurrency;

        TransactionHistory history = TransactionHistory.builder()
                .walletId(wallet.getId())
                .relatedWalletId(relatedWalletId)
                .type(type)
                .category(category)
                .amount(amount)
                .currencyCode(currency)
                .balanceBefore(balanceBefore)
                .balanceAfter(wallet.getBalance())
                .direction(direction)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();

        return transactionHistoryRepository.save(history)
                .doOnSuccess(h -> log.info("İşlem geçmişi kaydedildi. Cüzdan: {}, Tip: {}", wallet.getId(), type));
    }
}
