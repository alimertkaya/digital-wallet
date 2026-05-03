package com.alimertkaya.digitalwallet.consumer;

import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionType;
import com.alimertkaya.digitalwallet.wallet.dto.TransactionEvent;
import com.alimertkaya.digitalwallet.wallet.entity.Wallet;
import com.alimertkaya.digitalwallet.wallet.repository.TransactionHistoryRepository;
import com.alimertkaya.digitalwallet.wallet.repository.WalletRepository;
import com.alimertkaya.digitalwallet.notification.service.NotificationService;
import com.alimertkaya.digitalwallet.wallet.service.TransactionCategoryService;
import com.alimertkaya.digitalwallet.wallet.service.DeadLetterService;
import com.alimertkaya.digitalwallet.wallet.consumer.TransactionConsumer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionConsumerTest {

    @Mock WalletRepository walletRepository;
    @Mock TransactionHistoryRepository transactionHistoryRepository;
    @Mock NotificationService notificationService;
    @Mock TransactionCategoryService categoryService;
    @Mock DeadLetterService deadLetterService;

    @InjectMocks TransactionConsumer transactionConsumer;

    private Wallet wallet;

    @BeforeEach
    void setUp() {
        wallet = Wallet.builder()
                .id(1L).userId(10L).currencyCode("TRY")
                .balance(new BigDecimal("200.00")).build();
    }

    @Test
    void processDeposit_shouldIncreaseBalance() {
        TransactionEvent event = TransactionEvent.builder()
                .type(TransactionType.DEPOSIT)
                .sourceWalletId(1L)
                .sourceAmount(new BigDecimal("100.00"))
                .targetAmount(new BigDecimal("100.00"))
                .sourceCurrency("TRY").targetCurrency("TRY")
                .build();

        Wallet savedWallet = Wallet.builder().id(1L).userId(10L).currencyCode("TRY")
                .balance(new BigDecimal("300.00")).build();

        when(walletRepository.findById(1L)).thenReturn(Mono.just(wallet));
        when(walletRepository.save(any())).thenReturn(Mono.just(savedWallet));
        when(transactionHistoryRepository.save(any())).thenAnswer(inv -> Mono.just(inv.getArgument(0)));
        when(notificationService.createNotification(any(), any(), any(), any())).thenReturn(Mono.empty());

        StepVerifier.create(transactionConsumer.processDeposit(event))
                .verifyComplete();

        verify(walletRepository).save(argThat(w ->
                w.getBalance().compareTo(new BigDecimal("300.00")) == 0));
    }

    @Test
    void processDeposit_shouldReturnError_whenWalletNotFound() {
        TransactionEvent event = TransactionEvent.builder()
                .type(TransactionType.DEPOSIT)
                .sourceWalletId(99L)
                .sourceAmount(new BigDecimal("100.00"))
                .targetAmount(new BigDecimal("100.00"))
                .sourceCurrency("TRY").targetCurrency("TRY")
                .build();

        when(walletRepository.findById(99L)).thenReturn(Mono.empty());

        StepVerifier.create(transactionConsumer.processDeposit(event))
                .expectErrorSatisfies(e ->
                        assertThat(e).isInstanceOf(IllegalArgumentException.class))
                .verify();
    }

    @Test
    void processWithdraw_shouldDecreaseBalance() {
        TransactionEvent event = TransactionEvent.builder()
                .type(TransactionType.WITHDRAW)
                .sourceWalletId(1L)
                .sourceAmount(new BigDecimal("50.00"))
                .targetAmount(new BigDecimal("50.00"))
                .sourceCurrency("TRY").targetCurrency("TRY")
                .build();

        Wallet savedWallet = Wallet.builder().id(1L).userId(10L).currencyCode("TRY")
                .balance(new BigDecimal("150.00")).build();

        when(walletRepository.findById(1L)).thenReturn(Mono.just(wallet));
        when(walletRepository.save(any())).thenReturn(Mono.just(savedWallet));
        when(transactionHistoryRepository.save(any())).thenAnswer(inv -> Mono.just(inv.getArgument(0)));
        when(notificationService.createNotification(any(), any(), any(), any())).thenReturn(Mono.empty());
        when(categoryService.categorize(any(), any())).thenReturn(
                com.alimertkaya.digitalwallet.shared.dto.enums.TransactionCategory.OTHER);

        StepVerifier.create(transactionConsumer.processWithdraw(event))
                .verifyComplete();

        verify(walletRepository).save(argThat(w ->
                w.getBalance().compareTo(new BigDecimal("150.00")) == 0));
    }
}
