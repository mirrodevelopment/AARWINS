package com.aarwins.softdrinks.service;

import com.aarwins.softdrinks.dto.ProductDTO;
import com.aarwins.softdrinks.entity.Product;
import com.aarwins.softdrinks.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id).map(this::toDTO);
    }

    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .price(product.getPrice())
                .category(product.getCategory())
                .ingredients(product.getIngredients())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
