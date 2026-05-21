package com.aarwins.softdrinks.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsletterDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 200, message = "Email must be under 200 characters")
    private String email;
}
