package com.alimertkaya.digitalwallet.exchangerate.controller;

import com.alimertkaya.digitalwallet.exchangerate.entity.ExchangeRate;
import com.alimertkaya.digitalwallet.exchangerate.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/exchange-rates")
@RequiredArgsConstructor
public class ExchangeRateController {
    private final ExchangeRateService exchangeRateService;

    @GetMapping
    public Flux<ExchangeRate> getAllExchangeRates() {
        return exchangeRateService.getAllRates();
    }

    @GetMapping("/convert")
    public Mono<BigDecimal> convert(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam BigDecimal amount) {
        return exchangeRateService.convertCurrency(amount, from.toUpperCase(), to.toUpperCase());
    }
}
