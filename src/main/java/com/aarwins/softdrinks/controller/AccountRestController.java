package com.aarwins.softdrinks.controller;

import com.aarwins.softdrinks.dto.ApiResponseDTO;
import com.aarwins.softdrinks.entity.*;
import com.aarwins.softdrinks.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountRestController {

    private final AccountService accountService;
    private static final Long DEFAULT_USER_ID = 1L; // Mocked active user ID

    // ─── PROFILE ───
    @GetMapping("/profile")
    public ResponseEntity<ApiResponseDTO<User>> getProfile() {
        return accountService.getUserProfile(DEFAULT_USER_ID)
                .map(user -> ResponseEntity.ok(ApiResponseDTO.ok("Profile loaded", user)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponseDTO.error("Profile not found")));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponseDTO<User>> updateProfile(@RequestBody User user) {
        try {
            User updated = accountService.updateUserProfile(DEFAULT_USER_ID, user);
            return ResponseEntity.ok(ApiResponseDTO.ok("Profile updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponseDTO<String>> deleteAccount() {
        try {
            accountService.deleteUserAccount(DEFAULT_USER_ID);
            return ResponseEntity.ok(ApiResponseDTO.ok("Account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    // ─── ADDRESSES ───
    @GetMapping("/addresses")
    public ResponseEntity<ApiResponseDTO<List<Address>>> getAddresses() {
        List<Address> list = accountService.getAddresses(DEFAULT_USER_ID);
        return ResponseEntity.ok(ApiResponseDTO.ok("Addresses retrieved", list));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponseDTO<Address>> addAddress(@RequestBody Address address) {
        try {
            Address saved = accountService.addAddress(DEFAULT_USER_ID, address);
            return ResponseEntity.ok(ApiResponseDTO.ok("Address added successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponseDTO<Address>> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        try {
            Address updated = accountService.updateAddress(DEFAULT_USER_ID, id, address);
            return ResponseEntity.ok(ApiResponseDTO.ok("Address updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponseDTO<String>> deleteAddress(@PathVariable Long id) {
        try {
            accountService.deleteAddress(DEFAULT_USER_ID, id);
            return ResponseEntity.ok(ApiResponseDTO.ok("Address deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @PutMapping("/addresses/{id}/default")
    public ResponseEntity<ApiResponseDTO<Address>> setDefaultAddress(@PathVariable Long id) {
        try {
            Address updated = accountService.setDefaultAddress(DEFAULT_USER_ID, id);
            return ResponseEntity.ok(ApiResponseDTO.ok("Default address updated", updated));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    // ─── WISHLIST ───
    @GetMapping("/wishlist")
    public ResponseEntity<ApiResponseDTO<List<WishlistItem>>> getWishlist() {
        List<WishlistItem> list = accountService.getWishlist(DEFAULT_USER_ID);
        return ResponseEntity.ok(ApiResponseDTO.ok("Wishlist items loaded", list));
    }

    @PostMapping("/wishlist")
    public ResponseEntity<ApiResponseDTO<WishlistItem>> addToWishlist(@RequestBody Map<String, Long> body) {
        try {
            Long productId = body.get("productId");
            if (productId == null) {
                return ResponseEntity.status(400).body(ApiResponseDTO.error("productId is required"));
            }
            WishlistItem item = accountService.addToWishlist(DEFAULT_USER_ID, productId);
            return ResponseEntity.ok(ApiResponseDTO.ok("Added to wishlist", item));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @DeleteMapping("/wishlist/{productId}")
    public ResponseEntity<ApiResponseDTO<String>> removeFromWishlist(@PathVariable Long productId) {
        try {
            accountService.removeFromWishlist(DEFAULT_USER_ID, productId);
            return ResponseEntity.ok(ApiResponseDTO.ok("Removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    // ─── PAYMENT METHODS ───
    @GetMapping("/payment-methods")
    public ResponseEntity<ApiResponseDTO<List<PaymentMethod>>> getPaymentMethods() {
        List<PaymentMethod> list = accountService.getPaymentMethods(DEFAULT_USER_ID);
        return ResponseEntity.ok(ApiResponseDTO.ok("Payment methods retrieved", list));
    }

    @PostMapping("/payment-methods")
    public ResponseEntity<ApiResponseDTO<PaymentMethod>> addPaymentMethod(@RequestBody PaymentMethod card) {
        try {
            PaymentMethod saved = accountService.addPaymentMethod(DEFAULT_USER_ID, card);
            return ResponseEntity.ok(ApiResponseDTO.ok("Card saved successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    @DeleteMapping("/payment-methods/{id}")
    public ResponseEntity<ApiResponseDTO<String>> deletePaymentMethod(@PathVariable Long id) {
        try {
            accountService.deletePaymentMethod(DEFAULT_USER_ID, id);
            return ResponseEntity.ok(ApiResponseDTO.ok("Payment method removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    // ─── ORDERS ───
    @GetMapping("/orders")
    public ResponseEntity<ApiResponseDTO<List<Order>>> getOrders() {
        List<Order> list = accountService.getOrders(DEFAULT_USER_ID);
        return ResponseEntity.ok(ApiResponseDTO.ok("Orders loaded", list));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponseDTO<Order>> getOrderDetails(@PathVariable Long id) {
        return accountService.getOrderDetails(DEFAULT_USER_ID, id)
                .map(order -> ResponseEntity.ok(ApiResponseDTO.ok("Order details loaded", order)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponseDTO.error("Order not found")));
    }

    // ─── NOTIFICATIONS ───
    @GetMapping("/notifications")
    public ResponseEntity<ApiResponseDTO<NotificationPreferences>> getNotifications() {
        NotificationPreferences prefs = accountService.getNotificationPreferences(DEFAULT_USER_ID);
        return ResponseEntity.ok(ApiResponseDTO.ok("Preferences retrieved", prefs));
    }

    @PutMapping("/notifications")
    public ResponseEntity<ApiResponseDTO<NotificationPreferences>> updateNotifications(@RequestBody NotificationPreferences prefs) {
        try {
            NotificationPreferences updated = accountService.updateNotificationPreferences(DEFAULT_USER_ID, prefs);
            return ResponseEntity.ok(ApiResponseDTO.ok("Notification preferences updated", updated));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }

    // ─── CHANGE PASSWORD ───
    @PostMapping("/security/change-password")
    public ResponseEntity<ApiResponseDTO<String>> changePassword(@RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error("Missing currentPassword or newPassword"));
        }

        try {
            boolean success = accountService.changePassword(DEFAULT_USER_ID, currentPassword, newPassword);
            if (success) {
                return ResponseEntity.ok(ApiResponseDTO.ok("Password changed successfully"));
            } else {
                return ResponseEntity.status(400).body(ApiResponseDTO.error("Incorrect current password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDTO.error(e.getMessage()));
        }
    }
}
