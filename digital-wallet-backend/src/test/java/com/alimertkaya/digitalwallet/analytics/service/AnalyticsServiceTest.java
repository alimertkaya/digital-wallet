package com.alimertkaya.digitalwallet.analytics.service;

import com.alimertkaya.digitalwallet.analytics.service.impl.AnalyticsServiceImpl;
import com.alimertkaya.digitalwallet.exchangerate.service.ExchangeRateService;
import com.alimertkaya.digitalwallet.shared.dto.enums.HistoryDirection;
import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionCategory;
import com.alimertkaya.digitalwallet.user.entity.User;
import com.alimertkaya.digitalwallet.user.service.UserService;
import com.alimertkaya.digitalwallet.wallet.entity.TransactionHistory;
import com.alimertkaya.digitalwallet.wallet.entity.Wallet;
import com.alimertkaya.digitalwallet.wallet.repository.TransactionHistoryRepository;
import com.alimertkaya.digitalwallet.wallet.repository.WalletRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock TransactionHistoryRepository transactionHistoryRepository;
    @Mock WalletRepository walletRepository;
    @Mock ExchangeRateService exchangeRateService;
    @Mock UserService userService;

    @InjectMocks AnalyticsServiceImpl analyticsService;

    private User sampleUser() {
        return User.builder().id(1L).username("testuser").roles("ROLE_USER")
                .isEnabled(true).isLocked(false).build();
    }

    private Wallet sampleWallet(Long id, String currency, BigDecimal balance) {
        return Wallet.builder().id(id).userId(1L)
                .currencyCode(currency).balance(balance).build();
    }

    private TransactionHistory sampleHistory(HistoryDirection direction, BigDecimal amount,
                                              String currency, TransactionCategory category) {
        return TransactionHistory.builder()
                .walletId(1L).amount(amount).currencyCode(currency)
                .direction(direction).category(category)
                .createdAt(LocalDateTime.now()).build();
    }

    @Test
    void getMonthlyAnalysis_shouldReturnZeros_whenNoWallets() {
        when(userService.getCurrentUser()).thenReturn(Mono.just(sampleUser()));
        when(walletRepository.findByUserId(1L)).thenReturn(Flux.empty());

        StepVerifier.create(analyticsService.getMonthlyAnalysis())
                .assertNext(response -> {
                    assertThat(response.getTotalBalanceInUSD()).isEqualByComparingTo(BigDecimal.ZERO);
                    assertThat(response.getTotalBalanceInTL()).isEqualByComparingTo(BigDecimal.ZERO);
                })
                .verifyComplete();
    }

    @Test
    void getMonthlyAnalysis_shouldConvertBalancesToUsdAndTry() {
        Wallet wallet = sampleWallet(1L, "TRY", new BigDecimal("3250.00"));

        when(userService.getCurrentUser()).thenReturn(Mono.just(sampleUser()));
        when(walletRepository.findByUserId(1L)).thenReturn(Flux.just(wallet));
        when(exchangeRateService.convertCurrency(new BigDecimal("3250.00"), "TRY", "USD"))
                .thenReturn(Mono.just(new BigDecimal("100.00")));
        when(exchangeRateService.convertCurrency(new BigDecimal("3250.00"), "TRY", "TRY"))
                .thenReturn(Mono.just(new BigDecimal("3250.00")));
        when(transactionHistoryRepository.findByWalletIdInAndCreatedAtAfter(anyList(), any()))
                .thenReturn(Flux.empty());

        StepVerifier.create(analyticsService.getMonthlyAnalysis())
                .assertNext(response -> {
                    assertThat(response.getTotalBalanceInUSD()).isEqualByComparingTo(new BigDecimal("100.00"));
                    assertThat(response.getTotalBalanceInTL()).isEqualByComparingTo(new BigDecimal("3250.00"));
                    assertThat(response.getMonthlyIncome()).isEqualByComparingTo(BigDecimal.ZERO);
                    assertThat(response.getMonthlyExpense()).isEqualByComparingTo(BigDecimal.ZERO);
                })
                .verifyComplete();
    }

    @Test
    void getMonthlyAnalysis_shouldCalculateIncomeAndExpense() {
        Wallet wallet = sampleWallet(1L, "TRY", new BigDecimal("1000.00"));
        TransactionHistory income = sampleHistory(HistoryDirection.IN, new BigDecimal("500.00"), "TRY", TransactionCategory.DEPOSIT);
        TransactionHistory expense = sampleHistory(HistoryDirection.OUT, new BigDecimal("200.00"), "TRY", TransactionCategory.SHOPPING);

        when(userService.getCurrentUser()).thenReturn(Mono.just(sampleUser()));
        when(walletRepository.findByUserId(1L)).thenReturn(Flux.just(wallet));
        when(exchangeRateService.convertCurrency(any(), eq("TRY"), eq("USD")))
                .thenReturn(Mono.just(new BigDecimal("30.77")));
        when(exchangeRateService.convertCurrency(any(), eq("TRY"), eq("TRY")))
                .thenReturn(Mono.just(new BigDecimal("1000.00")));
        when(transactionHistoryRepository.findByWalletIdInAndCreatedAtAfter(eq(List.of(1L)), any()))
                .thenReturn(Flux.just(income, expense));
        when(exchangeRateService.convertCurrency(new BigDecimal("500.00"), "TRY", "TRY"))
                .thenReturn(Mono.just(new BigDecimal("500.00")));
        when(exchangeRateService.convertCurrency(new BigDecimal("200.00"), "TRY", "TRY"))
                .thenReturn(Mono.just(new BigDecimal("200.00")));

        StepVerifier.create(analyticsService.getMonthlyAnalysis())
                .assertNext(response -> {
                    assertThat(response.getMonthlyIncome()).isEqualByComparingTo(new BigDecimal("500.00"));
                    assertThat(response.getMonthlyExpense()).isEqualByComparingTo(new BigDecimal("200.00"));
                    assertThat(response.getCategoryDistribution()).hasSize(1);
                    assertThat(response.getCategoryDistribution().get(0).getCategory())
                            .isEqualTo(TransactionCategory.SHOPPING);
                })
                .verifyComplete();
    }
}
