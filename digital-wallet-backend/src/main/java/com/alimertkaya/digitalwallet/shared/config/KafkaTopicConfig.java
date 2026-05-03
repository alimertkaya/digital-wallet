package com.alimertkaya.digitalwallet.shared.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String WALLET_TRANSACTIONS_TOPIC = "wallet_transactions";
    public static final String WALLET_TRANSACTIONS_DLT = "wallet_transactions.DLT";

    @Value("${app.kafka.topic.partitions:1}")
    private int partitions;

    @Value("${app.kafka.topic.replicas:1}")
    private int replicas;

    @Bean
    public NewTopic walletTransactionsTopic() {
        return TopicBuilder.name(WALLET_TRANSACTIONS_TOPIC)
                .partitions(partitions)
                .replicas(replicas)
                .config(TopicConfig.RETENTION_MS_CONFIG, "604800000")
                .build();
    }

    @Bean
    public NewTopic walletTransactionsDlt() {
        return TopicBuilder.name(WALLET_TRANSACTIONS_DLT)
                .partitions(1)
                .replicas(replicas)
                .config(TopicConfig.RETENTION_MS_CONFIG, "604800000")
                .build();
    }
}