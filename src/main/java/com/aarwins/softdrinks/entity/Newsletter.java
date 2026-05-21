package com.aarwins.softdrinks.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 200)
    private String email;

    @Column(name = "subscribed_at")
    private LocalDateTime subscribedAt;

    @PrePersist
    public void prePersist() {
        if (subscribedAt == null) {
            subscribedAt = LocalDateTime.now();
        }
    }
}
