package com.aarwins.softdrinks.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless REST API
            .csrf(AbstractHttpConfigurer::disable)

            // Stateless — no HTTP session needed for public API
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public REST API endpoints
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/contact/**").permitAll()
                .requestMatchers("/api/newsletter/**").permitAll()

                // Public HTML pages and dynamic routes
                .requestMatchers("/product/**", "/product-details.html").permitAll()
                .requestMatchers("/collections", "/collections.html").permitAll()
                .requestMatchers("/checkout", "/checkout/**", "/checkout.html").permitAll()
                .requestMatchers("/account", "/account.html", "/api/account/**").permitAll()

                // Static frontend resources
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/fonts/**",
                    "/*.ico",
                    "/*.png",
                    "/*.svg"
                ).permitAll()

                // All other requests require authentication (future admin)
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
