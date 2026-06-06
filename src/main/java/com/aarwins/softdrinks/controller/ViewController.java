package com.aarwins.softdrinks.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ViewController {

    /**
     * Map dynamic product path /product/{id}
     * and forward internally to the static product details HTML page.
     * This keeps the REST URL structure clean in the browser.
     */
    @GetMapping("/product/{id}")
    public String getProductDetailsPage(@PathVariable String id) {
        return "forward:/product-details.html";
    }

    /**
     * Map /collections to the dedicated luxury editorial collections page.
     */
    @GetMapping("/collections")
    public String getCollectionsPage() {
        return "forward:/collections.html";
    }

    /**
     * Map /checkout and /checkout/payment to the dedicated premium checkout page.
     */
    @GetMapping({"/checkout", "/checkout/payment"})
    public String getCheckoutPage() {
        return "forward:/checkout.html";
    }

}

