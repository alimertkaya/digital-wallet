package com.alimertkaya.digitalwallet.wallet.service;

import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionCategory;
import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionType;

public interface TransactionCategoryService {
    TransactionCategory categorize(TransactionType type, String description);
}