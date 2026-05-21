package com.aarwins.softdrinks.service;

import com.aarwins.softdrinks.dto.NewsletterDTO;
import com.aarwins.softdrinks.entity.Newsletter;
import com.aarwins.softdrinks.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;

    /**
     * Subscribe an email to the newsletter.
     * @return true if newly subscribed, false if already subscribed.
     */
    public boolean subscribe(NewsletterDTO dto) {
        if (newsletterRepository.existsByEmail(dto.getEmail())) {
            log.info("Email already subscribed: {}", dto.getEmail());
            return false;
        }
        Newsletter entry = Newsletter.builder()
                .email(dto.getEmail())
                .build();
        newsletterRepository.save(entry);
        log.info("New newsletter subscription: {}", dto.getEmail());
        return true;
    }
}
