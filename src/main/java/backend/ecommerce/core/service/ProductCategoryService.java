package backend.ecommerce.core.service;

import backend.ecommerce.core.admin.product.CategoryForProductCreationResponse;
import backend.ecommerce.core.admin.product.CategoryResponse;
import backend.ecommerce.core.domain.Product;
import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import backend.ecommerce.core.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductRepository productRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository, ProductRepository productRepository) {
        this.productCategoryRepository = productCategoryRepository;
        this.productRepository = productRepository;
    }

    public Page<Product> getAllProductsOfCategory(String slug, Pageable pageable) {
        return this.productRepository.findAllByCategorySlug(slug, pageable);
    }

    public List<CategoryForProductCreationResponse> getCategoryListForProductCreation() {
        return this.productCategoryRepository.findAllCategoriesForProductCreation();
    }

    public List<CategoryResponse> getAllCategoryList() {
        return this.productCategoryRepository.findAllCategories();
    }
}
