package com.aarwins.softdrinks.service;

import com.aarwins.softdrinks.entity.*;
import com.aarwins.softdrinks.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final WishlistRepository wishlistRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final OrderRepository orderRepository;
    private final NotificationPreferencesRepository notificationPreferencesRepository;
    private final ProductRepository productRepository;

    // ─── USER PROFILE ───
    public Optional<User> getUserProfile(Long userId) {
        return userRepository.findById(userId);
    }

    public User updateUserProfile(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setDob(updatedUser.getDob());
        user.setGender(updatedUser.getGender());

        return userRepository.save(user);
    }

    public void deleteUserAccount(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        // Since other tables reference user, we delete them first or trust cascade
        // Clean up manual relations if necessary
        addressRepository.findByUserId(userId).forEach(addressRepository::delete);
        paymentMethodRepository.findByUserId(userId).forEach(paymentMethodRepository::delete);
        wishlistRepository.findByUserId(userId).forEach(wishlistRepository::delete);
        orderRepository.findByUserIdOrderByOrderDateDesc(userId).forEach(orderRepository::delete);
        notificationPreferencesRepository.findByUserId(userId).ifPresent(notificationPreferencesRepository::delete);

        userRepository.deleteById(userId);
    }

    // ─── ADDRESS MANAGEMENT ───
    public List<Address> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address addAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        address.setUser(user);

        if (address.getIsDefault()) {
            resetDefaultAddresses(userId);
        }

        // If it's the first address, make it default automatically
        List<Address> existing = addressRepository.findByUserId(userId);
        if (existing.isEmpty()) {
            address.setIsDefault(true);
        }

        return addressRepository.save(address);
    }

    public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to this user");
        }

        address.setFullName(addressDetails.getFullName());
        address.setPhone(addressDetails.getPhone());
        address.setFlatHouse(addressDetails.getFlatHouse());
        address.setAreaStreet(addressDetails.getAreaStreet());
        address.setLandmark(addressDetails.getLandmark());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setPincode(addressDetails.getPincode());
        address.setCountry(addressDetails.getCountry());
        address.setAddressType(addressDetails.getAddressType());

        if (addressDetails.getIsDefault() && !address.getIsDefault()) {
            resetDefaultAddresses(userId);
            address.setIsDefault(true);
        } else if (!addressDetails.getIsDefault() && address.getIsDefault()) {
            // Can't unset default if it's the only one, otherwise allow it
            address.setIsDefault(false);
        }

        return addressRepository.save(address);
    }

    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to this user");
        }

        addressRepository.delete(address);

        // If we deleted the default address, make another one default
        if (address.getIsDefault()) {
            List<Address> remaining = addressRepository.findByUserId(userId);
            if (!remaining.isEmpty()) {
                Address first = remaining.get(0);
                first.setIsDefault(true);
                addressRepository.save(first);
            }
        }
    }

    public Address setDefaultAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to this user");
        }

        resetDefaultAddresses(userId);
        address.setIsDefault(true);
        return addressRepository.save(address);
    }

    private void resetDefaultAddresses(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address addr : addresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    // ─── WISHLIST ───
    public List<WishlistItem> getWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public WishlistItem addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Optional<WishlistItem> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            return existing.get();
        }

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        return wishlistRepository.save(item);
    }

    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    // ─── PAYMENT METHODS ───
    public List<PaymentMethod> getPaymentMethods(Long userId) {
        return paymentMethodRepository.findByUserId(userId);
    }

    public PaymentMethod addPaymentMethod(Long userId, PaymentMethod card) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        card.setUser(user);

        if (card.getIsDefault()) {
            resetDefaultCards(userId);
        }

        List<PaymentMethod> existing = paymentMethodRepository.findByUserId(userId);
        if (existing.isEmpty()) {
            card.setIsDefault(true);
        }

        return paymentMethodRepository.save(card);
    }

    public void deletePaymentMethod(Long userId, Long cardId) {
        PaymentMethod card = paymentMethodRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));

        if (!card.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Card does not belong to this user");
        }

        paymentMethodRepository.delete(card);

        if (card.getIsDefault()) {
            List<PaymentMethod> remaining = paymentMethodRepository.findByUserId(userId);
            if (!remaining.isEmpty()) {
                PaymentMethod first = remaining.get(0);
                first.setIsDefault(true);
                paymentMethodRepository.save(first);
            }
        }
    }

    private void resetDefaultCards(Long userId) {
        List<PaymentMethod> cards = paymentMethodRepository.findByUserId(userId);
        for (PaymentMethod card : cards) {
            if (card.getIsDefault()) {
                card.setIsDefault(false);
                paymentMethodRepository.save(card);
            }
        }
    }

    // ─── ORDERS ───
    public List<Order> getOrders(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public Optional<Order> getOrderDetails(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .filter(order -> order.getUser().getId().equals(userId));
    }

    // ─── NOTIFICATION PREFERENCES ───
    public NotificationPreferences getNotificationPreferences(Long userId) {
        return notificationPreferencesRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    NotificationPreferences prefs = NotificationPreferences.builder()
                            .user(user)
                            .emailNewsletter(true)
                            .orderUpdates(true)
                            .smsPromotions(false)
                            .build();
                    return notificationPreferencesRepository.save(prefs);
                });
    }

    public NotificationPreferences updateNotificationPreferences(Long userId, NotificationPreferences updatedPrefs) {
        NotificationPreferences prefs = getNotificationPreferences(userId);
        prefs.setEmailNewsletter(updatedPrefs.getEmailNewsletter());
        prefs.setOrderUpdates(updatedPrefs.getOrderUpdates());
        prefs.setSmsPromotions(updatedPrefs.getSmsPromotions());
        return notificationPreferencesRepository.save(prefs);
    }

    // ─── PASSWORD CHANGE ───
    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Using plain-text password comparison
        if (!user.getPassword().equals(currentPassword)) {
            return false;
        }

        user.setPassword(newPassword);
        userRepository.save(user);
        return true;
    }
}
