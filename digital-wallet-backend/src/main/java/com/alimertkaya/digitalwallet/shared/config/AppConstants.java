package com.alimertkaya.digitalwallet.shared.config;

import java.math.BigDecimal;

public final class AppConstants {

    private AppConstants() {}

    public static final String DEFAULT_ROLE = "ROLE_USER";
    public static final String KAFKA_GROUP_ID = "digital-wallet-group";
    public static final BigDecimal MAX_TRANSACTION_AMOUNT = new BigDecimal("999999.99");
    public static final int VERIFICATION_CODE_LENGTH = 6;
    public static final int VERIFICATION_CODE_TTL_MINUTES = 5;
    public static final String PHONE_REGEX = "^(\\+90|0)?[0-9]{10}$";
}
