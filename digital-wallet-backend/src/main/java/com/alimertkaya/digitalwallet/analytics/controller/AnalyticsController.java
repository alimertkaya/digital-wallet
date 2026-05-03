package com.alimertkaya.digitalwallet.analytics.controller;

import com.alimertkaya.digitalwallet.analytics.dto.AnalysisResponse;
import com.alimertkaya.digitalwallet.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/monthly")
    public Mono<AnalysisResponse> getWalletAnalytics() {
        return analyticsService.getMonthlyAnalysis();
    }
}