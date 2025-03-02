package backend.ecommerce.core.admin.product;

import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.domain.Property;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import backend.ecommerce.core.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final ProductCategoryRepository productCategoryRepository;

    public PropertyService(PropertyRepository propertyRepository, ProductCategoryRepository productCategoryRepository) {
        this.propertyRepository = propertyRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    public List<PropertyResponse> getPropertyListByProductCategoryId(Long categoryId) {
        return this.propertyRepository.findAllPropertiesByProductCategoryId(categoryId);
    }

    public void addNewProperty(NewPropertyRequest dto) {
        ProductCategory productCategory = this.productCategoryRepository.findById(dto.productCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Product category not found for id: " + dto.productCategoryId()));
        Property property = new Property(productCategory,dto.propertyName(), dto.propertyValue());
        this.propertyRepository.save(property);
    }
}
