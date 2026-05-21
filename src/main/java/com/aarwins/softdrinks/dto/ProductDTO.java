package com.aarwins.softdrinks.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private String category;
    private String ingredients;
    private LocalDateTime createdAt;
}
