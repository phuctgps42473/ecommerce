package backend.ecommerce.core.service;

import backend.ecommerce.core.domain.ProductVariant;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;

    public ProductVariantService(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    public Double getStockOfVariantId(Long variantId) {
        return this.productVariantRepository.findStockByVariantId(variantId).orElseThrow(() -> new ResourceNotFoundException("No product variant found"));
    }

    public ProductVariant getProductVariantById(Long id) {
        return this.productVariantRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No product variant found"));
    }
}
