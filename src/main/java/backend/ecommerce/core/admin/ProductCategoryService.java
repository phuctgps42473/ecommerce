package backend.ecommerce.core.admin;

import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.dto.ProductCategoryDTO;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public AdminProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public ProductCategory createNewProductCategory(ProductCategoryDTO dto) {
        ProductCategory productCategory = new ProductCategory(dto.name(), dto.description());
        return this.productCategoryRepository.save(productCategory);
    }

    public void updateProductCategory(ProductCategory productCategory, ProductCategoryDTO dto) {
        productCategory.setName(dto.name());
        productCategory.setDescription(dto.description());
        this.productCategoryRepository.save(productCategory);
    }

    public void deleteProductCategory(Long productCategoryId) {
        this.productCategoryRepository.deleteById(productCategoryId);
    }

}
