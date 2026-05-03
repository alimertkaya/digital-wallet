package com.alimertkaya.digitalwallet.wallet.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("outbox_events")
public class OutboxEvent {

    @Id
    private Long id;

    @Column("event_type")
    private String eventType;

    @Column("payload")
    private String payload;

    @Column("published")
    private boolean published;

    @Column("published_at")
    private LocalDateTime publishedAt;

    @Column("created_at")
    private LocalDateTime createdAt;
}
