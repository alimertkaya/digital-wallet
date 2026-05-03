package com.alimertkaya.digitalwallet.integration;

import com.alimertkaya.digitalwallet.auth.dto.AuthResponse;
import com.alimertkaya.digitalwallet.wallet.dto.WalletResponse;
import com.alimertkaya.digitalwallet.wallet.repository.WalletRepository;
import com.alimertkaya.digitalwallet.shared.security.TokenBlacklistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
@Testcontainers
@ActiveProfiles("test")
@EmbeddedKafka(
        partitions = 1,
        topics = {"wallet_transactions", "wallet_transactions.DLT"},
        bootstrapServersProperty = "spring.kafka.bootstrap-servers"
)
class WalletIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("digital_wallet_test")
            .withUsername("root")
            .withPassword("root");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.r2dbc.url", () ->
                "r2dbc:postgresql://" + postgres.getHost() + ":" + postgres.getFirstMappedPort() + "/digital_wallet_test");
        registry.add("spring.r2dbc.username", postgres::getUsername);
        registry.add("spring.r2dbc.password", postgres::getPassword);
        registry.add("spring.sql.init.url", postgres::getJdbcUrl);
        registry.add("spring.sql.init.username", postgres::getUsername);
        registry.add("spring.sql.init.password", postgres::getPassword);
    }

    @Autowired WebTestClient webTestClient;
    @Autowired WalletRepository walletRepository;

    // Redis'i mock'la — integration test'te Redis container'ı ayağa kaldırmak gerekmez
    @MockBean TokenBlacklistService tokenBlacklistService;

    private static final String REGISTER_BODY = """
            {
              "username": "integrationuser",
              "password": "pass1234",
              "email": "integration@test.com",
              "phoneNumber": "05321234567",
              "firstName": "Test",
              "lastName": "User",
              "birthDate": "1990-01-01",
              "tckn": "12345678901"
            }
            """;

    @Test
    void fullWalletFlow_registerDepositAndCheckBalance() {
        when(tokenBlacklistService.isBlacklisted(anyString())).thenReturn(Mono.just(false));
        when(tokenBlacklistService.blacklist(anyString(), any())).thenReturn(Mono.empty());

        // 1. Kullanıcı kaydı → JWT token al
        AuthResponse authResponse = webTestClient.post().uri("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(REGISTER_BODY)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(AuthResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(authResponse).isNotNull();
        assertThat(authResponse.getToken()).isNotBlank();
        String token = "Bearer " + authResponse.getToken();

        // 2. Cüzdan oluştur
        WalletResponse wallet = webTestClient.post().uri("/api/v1/wallets")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"name\":\"Ana Cüzdan\",\"currencyCode\":\"TRY\"}")
                .exchange()
                .expectStatus().isCreated()
                .expectBody(WalletResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(wallet).isNotNull();
        assertThat(wallet.getId()).isPositive();
        assertThat(wallet.getBalance()).isEqualByComparingTo(BigDecimal.ZERO);

        Long walletId = wallet.getId();

        // 3. Para yatır (Kafka event publish eder)
        webTestClient.post().uri("/api/v1/wallets/{id}/deposit", walletId)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"amount\":250.00}")
                .exchange()
                .expectStatus().isAccepted();

        // 4. Kafka consumer'ın işlemesi için bekle → bakiyeyi doğrula
        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            StepVerifier.create(walletRepository.findById(walletId))
                    .assertNext(w -> assertThat(w.getBalance())
                            .isEqualByComparingTo(new BigDecimal("250.00")))
                    .verifyComplete();
        });
    }

    @Test
    void createWallet_shouldReturn401_whenNotAuthenticated() {
        webTestClient.post().uri("/api/v1/wallets")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"name\":\"Cüzdan\",\"currencyCode\":\"TRY\"}")
                .exchange()
                .expectStatus().isUnauthorized();
    }
}
