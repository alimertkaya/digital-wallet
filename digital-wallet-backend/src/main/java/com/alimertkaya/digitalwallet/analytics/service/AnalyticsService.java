package com.alimertkaya.digitalwallet.analytics.service;

import com.alimertkaya.digitalwallet.analytics.dto.AnalysisResponse;
import reactor.core.publisher.Mono;

public interface AnalyticsService {
    Mono<AnalysisResponse> getMonthlyAnalysis();
}