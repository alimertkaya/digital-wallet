package com.alimertkaya.digitalwallet.service;

import com.alimertkaya.digitalwallet.exchangerate.service.ExchangeRateService;
import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionType;
import com.alimertkaya.digitalwallet.shared.security.SecurityContextHelper;
import com.alimertkaya.digitalwallet.wallet.dto.DepositRequest;
import com.alimertkaya.digitalwallet.wallet.dto.TransferRequest;
import com.alimertkaya.digitalwallet.wallet.dto.WithdrawRequest;
import com.alimertkaya.digitalwallet.wallet.entity.Wallet;
import com.alimertkaya.digitalwallet.wallet.repository.TransactionHistoryRepository;
import com.alimertkaya.digitalwallet.wallet.repository.WalletRepository;
import com.alimertkaya.digitalwallet.wallet.service.OutboxService;
import com.alimertkaya.digitalwallet.wallet.service.impl.WalletServiceImpl;
import com.alimertkaya.digitalwallet.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock WalletRepository walletRepository;
    @Mock OutboxService outboxService;
    @Mock TransactionHistoryRepository transactionHistoryRepository;
    @Mock ExchangeRateService exchangeRateService;
    @Mock SecurityContextHelper securityContextHelper;

    @InjectMocks WalletServiceImpl walletService;

    private User testUser;
    private Wallet testWallet;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L).username("testuser").email("test@test.com")
                .roles("ROLE_USER").isEnabled(true).isLocked(false)
                .build();

        testWallet = Wallet.builder()
                .id(10L).userId(1L).name("Ana Cüzdan")
                .currencyCode("TRY").balance(new BigDecimal("500.00"))
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void depositToWallet_shouldSaveToOutbox_whenWalletBelongsToUser() {
        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByIdAndUserId(10L, 1L)).thenReturn(Mono.just(testWallet));
        when(outboxService.save(any())).thenReturn(Mono.empty());

        DepositRequest request = new DepositRequest(new BigDecimal("100.00"));

        StepVerifier.create(walletService.depositToWallet(10L, request))
                .verifyComplete();

        verify(outboxService).save(argThat(event ->
                event.getType() == TransactionType.DEPOSIT &&
                event.getSourceAmount().compareTo(new BigDecimal("100.00")) == 0 &&
                event.getSourceWalletId().equals(10L)
        ));
    }

    @Test
    void depositToWallet_shouldReturnNotFound_whenWalletNotBelongsToUser() {
        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByIdAndUserId(10L, 1L)).thenReturn(Mono.empty());

        DepositRequest request = new DepositRequest(new BigDecimal("100.00"));

        StepVerifier.create(walletService.depositToWallet(10L, request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                })
                .verify();
    }

    @Test
    void transferFunds_shouldReturnBadRequest_whenInsufficientBalance() {
        Wallet sourceWallet = Wallet.builder()
                .id(10L).userId(1L).currencyCode("TRY")
                .balance(new BigDecimal("50.00")).build();
        Wallet targetWallet = Wallet.builder()
                .id(20L).userId(2L).currencyCode("TRY")
                .balance(BigDecimal.ZERO).build();

        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByIdAndUserId(10L, 1L)).thenReturn(Mono.just(sourceWallet));
        when(walletRepository.findById(20L)).thenReturn(Mono.just(targetWallet));

        TransferRequest request = new TransferRequest(20L, new BigDecimal("200.00"), null, null);

        StepVerifier.create(walletService.transferFunds(10L, request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                })
                .verify();
    }

    @Test
    void transferFunds_shouldReturnBadRequest_whenSelfTransfer() {
        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByIdAndUserId(10L, 1L)).thenReturn(Mono.just(testWallet));
        when(walletRepository.findById(10L)).thenReturn(Mono.just(testWallet));

        TransferRequest request = new TransferRequest(10L, new BigDecimal("100.00"), null, null);

        StepVerifier.create(walletService.transferFunds(10L, request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                })
                .verify();
    }

    @Test
    void withdrawFromWallet_shouldReturnBadRequest_whenInsufficientBalance() {
        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByIdAndUserId(10L, 1L)).thenReturn(Mono.just(testWallet));

        WithdrawRequest request = new WithdrawRequest(new BigDecimal("999.00"), "test");

        StepVerifier.create(walletService.withdrawFromWallet(10L, request))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                })
                .verify();
    }

    @Test
    void getCurrentUserWallets_shouldReturnWalletList() {
        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByUserIdPaged(eq(1L), anyInt(), anyInt()))
                .thenReturn(Flux.just(testWallet));

        StepVerifier.create(walletService.getCurrentUserWallets(0, 20))
                .expectNextMatches(response -> response.getId().equals(10L))
                .verifyComplete();
    }

    @Test
    void deleteWallet_shouldReturnBadRequest_whenBalanceNotZero() {
        when(securityContextHelper.getCurrentUserId()).thenReturn(Mono.just(1L));
        when(walletRepository.findByIdAndUserId(10L, 1L)).thenReturn(Mono.just(testWallet));

        StepVerifier.create(walletService.deleteWallet(10L))
                .expectErrorSatisfies(e -> {
                    assertThat(e).isInstanceOf(ResponseStatusException.class);
                    assertThat(((ResponseStatusException) e).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                })
                .verify();
    }
}
