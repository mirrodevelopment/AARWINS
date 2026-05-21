package com.aarwins.softdrinks.controller;

import com.aarwins.softdrinks.dto.ApiResponseDTO;
import com.aarwins.softdrinks.dto.ProductDTO;
import com.aarwins.softdrinks.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products
     * Returns all products ordered by newest first.
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<ProductDTO>>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(
                ApiResponseDTO.ok("Products retrieved successfully", products)
        );
    }

    /**
     * GET /api/products/{id}
     * Returns a single product by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<ProductDTO>> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> ResponseEntity.ok(
                        ApiResponseDTO.ok("Product found", product)
                ))
                .orElseGet(() -> ResponseEntity.status(404).body(
                        ApiResponseDTO.error("Product not found with id: " + id)
                ));
    }
}
