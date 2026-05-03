package com.alimertkaya.digitalwallet.wallet.controller;

import com.alimertkaya.digitalwallet.wallet.dto.*;
import com.alimertkaya.digitalwallet.shared.security.JwtService;
import com.alimertkaya.digitalwallet.shared.security.TokenBlacklistService;
import com.alimertkaya.digitalwallet.wallet.service.WalletService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebFluxTest(controllers = WalletController.class)
class WalletControllerTest {

    @Autowired WebTestClient webTestClient;

    @MockBean WalletService walletService;
    @MockBean JwtService jwtService;
    @MockBean TokenBlacklistService tokenBlacklistService;
    @MockBean ReactiveUserDetailsService userDetailsService;

    private WalletResponse sampleWallet() {
        return WalletResponse.builder()
                .id(1L).userId(10L).name("Ana Cüzdan")
                .currencyCode("TRY").balance(new BigDecimal("500.00"))
                .createdAt(LocalDateTime.now()).build();
    }

    @Test
    @WithMockUser
    void createWallet_shouldReturn201_whenRequestValid() {
        when(walletService.createWallet(any())).thenReturn(Mono.just(sampleWallet()));

        webTestClient.post().uri("/api/v1/wallets")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"name\":\"Ana Cüzdan\",\"currencyCode\":\"TRY\"}")
                .exchange()
                .expectStatus().isCreated()
                .expectBody()
                .jsonPath("$.id").isEqualTo(1)
                .jsonPath("$.currencyCode").isEqualTo("TRY");
    }

    @Test
    @WithMockUser
    void createWallet_shouldReturn400_whenCurrencyCodeMissing() {
        webTestClient.post().uri("/api/v1/wallets")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"name\":\"Ana Cüzdan\"}")
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    @WithMockUser
    void getCurrentUserWallets_shouldReturn200_withList() {
        when(walletService.getCurrentUserWallets()).thenReturn(Flux.just(sampleWallet(), sampleWallet()));

        webTestClient.get().uri("/api/v1/wallets")
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(WalletResponse.class).hasSize(2);
    }

    @Test
    @WithMockUser
    void getWalletById_shouldReturn200_whenFound() {
        when(walletService.getWalletById(1L)).thenReturn(Mono.just(sampleWallet()));

        webTestClient.get().uri("/api/v1/wallets/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.id").isEqualTo(1);
    }

    @Test
    @WithMockUser
    void depositToWallet_shouldReturn202_whenValid() {
        when(walletService.depositToWallet(eq(1L), any())).thenReturn(Mono.empty());

        webTestClient.post().uri("/api/v1/wallets/1/deposit")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"amount\":100.00}")
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.ACCEPTED);

        verify(walletService).depositToWallet(eq(1L), any());
    }

    @Test
    @WithMockUser
    void depositToWallet_shouldReturn400_whenAmountZero() {
        webTestClient.post().uri("/api/v1/wallets/1/deposit")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"amount\":0}")
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    @WithMockUser
    void withdrawFromWallet_shouldReturn202_whenValid() {
        when(walletService.withdrawFromWallet(eq(1L), any())).thenReturn(Mono.empty());

        webTestClient.post().uri("/api/v1/wallets/1/withdraw")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"amount\":50.00}")
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.ACCEPTED);
    }

    @Test
    @WithMockUser
    void transferFunds_shouldReturn202_whenValid() {
        when(walletService.transferFunds(eq(1L), any())).thenReturn(Mono.empty());

        webTestClient.post().uri("/api/v1/wallets/1/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"targetWalletId\":2,\"amount\":100.00}")
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.ACCEPTED);
    }

    @Test
    @WithMockUser
    void deleteWallet_shouldReturn204() {
        when(walletService.deleteWallet(1L)).thenReturn(Mono.empty());

        webTestClient.delete().uri("/api/v1/wallets/1")
                .exchange()
                .expectStatus().isNoContent();
    }
}
