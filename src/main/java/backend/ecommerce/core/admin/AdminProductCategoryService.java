package backend.ecommerce.core.admin;

import backend.ecommerce.core.ProductCategory;
import backend.ecommerce.core.dto.ProductCategoryDTO;
import backend.ecommerce.core.repository.ProductCategoryRepository;

public class AdminProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public AdminProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public void createNewProductCategory(ProductCategoryDTO dto) {
        ProductCategory productCategory = new ProductCategory(dto.name(), dto.description());
        this.productCategoryRepository.save(productCategory);
    }

    public void updateProductCategory(ProductCategory productCategory, ProductCategoryDTO dto) {
        productCategory.setName(dto.name());
        productCategory.setDescription(dto.description());
        this.productCategoryRepository.save(productCategory);
    }

}
