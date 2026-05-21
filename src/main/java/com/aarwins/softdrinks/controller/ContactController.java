package com.aarwins.softdrinks.controller;

import com.aarwins.softdrinks.dto.ApiResponseDTO;
import com.aarwins.softdrinks.dto.ContactMessageDTO;
import com.aarwins.softdrinks.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * POST /api/contact
     * Saves a contact form message to the database.
     */
    @PostMapping
    public ResponseEntity<ApiResponseDTO<Void>> submitContact(
            @Valid @RequestBody ContactMessageDTO dto
    ) {
        contactService.saveMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponseDTO.ok("Thank you! Your message has been received. We'll be in touch soon.")
        );
    }
}
