package com.aarwins.softdrinks.controller;

import com.aarwins.softdrinks.dto.ApiResponseDTO;
import com.aarwins.softdrinks.dto.NewsletterDTO;
import com.aarwins.softdrinks.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    /**
     * POST /api/newsletter
     * Subscribes an email to the Aarwins newsletter.
     */
    @PostMapping
    public ResponseEntity<ApiResponseDTO<Void>> subscribe(
            @Valid @RequestBody NewsletterDTO dto
    ) {
        boolean isNew = newsletterService.subscribe(dto);
        if (isNew) {
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponseDTO.ok("You're in! Welcome to the Aarwins tropical circle.")
            );
        } else {
            return ResponseEntity.ok(
                    ApiResponseDTO.ok("You're already subscribed — we'll keep the good stuff coming!")
            );
        }
    }
}
