package com.alimertkaya.digitalwallet.analytics.dto;

import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CategorySpendResponse {
    private TransactionCategory category;
    private BigDecimal amount;
    private double percentage;
}