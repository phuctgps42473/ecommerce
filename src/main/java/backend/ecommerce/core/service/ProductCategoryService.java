package backend.ecommerce.core.service;

import backend.ecommerce.core.domain.Product;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import backend.ecommerce.core.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductCategoryService {
    private ProductCategoryRepository productCategoryRepository;
    private ProductRepository productRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public Page<Product> getAllProductsOfCategory(String slug, Pageable pageable) {
        return this.productRepository.findAllByCategorySlug(slug, pageable);
    }
}
