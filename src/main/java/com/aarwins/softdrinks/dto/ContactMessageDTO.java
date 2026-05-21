package com.aarwins.softdrinks.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessageDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must be under 150 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    @Size(max = 200, message = "Email must be under 200 characters")
    private String email;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;
}
