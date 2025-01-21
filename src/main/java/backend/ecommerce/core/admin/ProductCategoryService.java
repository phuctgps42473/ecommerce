package backend.ecommerce.core.admin;

import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.dto.ProductCategoryDTO;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }


    public ProductCategoryDTO getProductCategoryById(Long id) {
        return this.productCategoryRepository
                .findById(id).map(category -> new ProductCategoryDTO(category.getId(), category.getName(), category.getDescription()))
                .orElseThrow(() -> new ResourceNotFoundException(ProductCategory.ENTITY_NAME, id));
    }

    public ProductCategory getProductCategoryForUpdate(Long id) {
        return this.productCategoryRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ProductCategory.ENTITY_NAME, id));
    }

    public List<ProductCategoryDTO> getProductCategories(Pageable pageable) {
        return this.productCategoryRepository.findAll(pageable).map(category -> new ProductCategoryDTO(category.getId(), category.getName(), category.getDescription())).toList();
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

    public void deleteProductCategoryById(Long productCategoryId) {
        this.productCategoryRepository.deleteById(productCategoryId);
    }


}
