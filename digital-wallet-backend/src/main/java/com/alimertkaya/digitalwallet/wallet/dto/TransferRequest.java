package com.alimertkaya.digitalwallet.wallet.dto;

import com.alimertkaya.digitalwallet.shared.dto.enums.TransactionCategory;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {

    @NotNull(message = "Hedef cüzdan ID'si boş olamaz")
    private Long targetWalletId;

    @NotNull(message = "Tutar boş olamaz")
    @DecimalMin(value = "0.01", message = "Tutar en az 0.01 olmalıdır")
    @DecimalMax(value = "999999.99", message = "Tek işlemde maksimum 999.999,99 transfer yapılabilir")
    @Digits(integer = 6, fraction = 2, message = "Tutar en fazla 6 tam ve 2 ondalık basamak içerebilir")
    private BigDecimal amount;
    private TransactionCategory category;
    private String description;
}
