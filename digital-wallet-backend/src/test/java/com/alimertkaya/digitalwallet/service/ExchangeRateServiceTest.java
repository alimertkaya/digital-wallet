package com.alimertkaya.digitalwallet.exchangerate.service;

import com.alimertkaya.digitalwallet.exchangerate.entity.ExchangeRate;
import com.alimertkaya.digitalwallet.exchangerate.repository.ExchangeRateRepository;
import com.alimertkaya.digitalwallet.exchangerate.service.impl.ExchangeRateServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExchangeRateServiceTest {

    @Mock ExchangeRateRepository exchangeRateRepository;
    @Mock WebClient webClient;

    @InjectMocks ExchangeRateServiceImpl exchangeRateService;

    private ExchangeRate rate(String src, String tgt, String value) {
        return ExchangeRate.builder()
                .sourceCurrency(src).targetCurrency(tgt)
                .rate(new BigDecimal(value)).build();
    }

    @Test
    void convertCurrency_shouldReturnSameAmount_whenSameCurrency() {
        StepVerifier.create(exchangeRateService.convertCurrency(
                        new BigDecimal("100.00"), "TRY", "TRY"))
                .expectNextMatches(r -> r.compareTo(new BigDecimal("100.00")) == 0)
                .verifyComplete();
    }

    @Test
    void convertCurrency_shouldMultiplyByRate_whenSourceIsUsd() {
        when(exchangeRateRepository.findBySourceCurrencyAndTargetCurrency("USD", "TRY"))
                .thenReturn(Mono.just(rate("USD", "TRY", "32.50")));

        StepVerifier.create(exchangeRateService.convertCurrency(
                        new BigDecimal("10.00"), "USD", "TRY"))
                .expectNextMatches(r -> r.compareTo(new BigDecimal("325.00")) == 0)
                .verifyComplete();
    }

    @Test
    void convertCurrency_shouldDivideByRate_whenTargetIsUsd() {
        when(exchangeRateRepository.findBySourceCurrencyAndTargetCurrency("USD", "TRY"))
                .thenReturn(Mono.just(rate("USD", "TRY", "32.50")));

        StepVerifier.create(exchangeRateService.convertCurrency(
                        new BigDecimal("325.00"), "TRY", "USD"))
                .expectNextMatches(r -> r.compareTo(new BigDecimal("10.00")) == 0)
                .verifyComplete();
    }

    @Test
    void convertCurrency_shouldUseCrossRate_whenBothNonUsd() {
        when(exchangeRateRepository.findBySourceCurrencyAndTargetCurrency("USD", "TRY"))
                .thenReturn(Mono.just(rate("USD", "TRY", "32.50")));
        when(exchangeRateRepository.findBySourceCurrencyAndTargetCurrency("USD", "EUR"))
                .thenReturn(Mono.just(rate("USD", "EUR", "0.92")));

        // 325 TRY -> EUR: 325 / 32.50 = 10 USD -> 10 * 0.92 = 9.20 EUR
        StepVerifier.create(exchangeRateService.convertCurrency(
                        new BigDecimal("325.00"), "TRY", "EUR"))
                .expectNextMatches(r -> r.compareTo(new BigDecimal("9.20")) == 0)
                .verifyComplete();
    }
}
