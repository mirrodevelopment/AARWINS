package com.aarwins.softdrinks.service;

import com.aarwins.softdrinks.dto.ContactMessageDTO;
import com.aarwins.softdrinks.entity.ContactMessage;
import com.aarwins.softdrinks.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public void saveMessage(ContactMessageDTO dto) {
        ContactMessage message = ContactMessage.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .message(dto.getMessage())
                .build();
        contactMessageRepository.save(message);
        log.info("Contact message saved from: {}", dto.getEmail());
    }
}
