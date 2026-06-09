package com.aarwins.softdrinks.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String cardNumber; // Masked

    @Column(nullable = false, length = 150)
    private String cardholderName;

    @Column(nullable = false, length = 10)
    private String expiryDate;

    @Column(nullable = false, length = 50)
    private String cardType;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;
}
