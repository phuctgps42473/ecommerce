package backend.ecommerce.core.admin.product;

import backend.ecommerce.core.domain.*;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import backend.ecommerce.core.repository.ProductRepository;
import backend.ecommerce.core.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminProductService {
    public final ProductRepository productRepository;
    public final ProductCategoryRepository productCategoryRepository;
    private final PropertyRepository propertyRepository;

    public AdminProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository, PropertyRepository propertyRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.propertyRepository = propertyRepository;
    }

    public Page<PreviewProductResponse> getProductList(Pageable pageable) {
        return this.productRepository.findAllAdminPreviewProduct(pageable);
    }

    public Product getProductById(Long id) {
        // TODO: FIX ME
        return this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No product found with id: " + id));
    }

    public void createNewProduct(NewProductRequest dto) {
        System.out.println(dto.productVariantList().getFirst().gtin());
        ProductCategory category = this.productCategoryRepository.findById(dto.productCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Product product = new Product(
                category,
                dto.productBrand(),
                0.0,
                dto.productName(),
                dto.dimensionsMM(),
                dto.weight(),
                "",
                dto.productProfileImage(),
                dto.description()
        );

        product.setProductVariantList(dto.productVariantList().stream().map(v -> new ProductVariant(product, v.name(), v.sku(), v.gtin(), v.image(), v.price(), v.stock())).collect(Collectors.toSet()));

        Set<ProductProperty> productPropertyList = this.propertyRepository
                .findAllInIdList(dto.propertyIdList()).stream()
                .map(p -> new ProductProperty(product, p))
                .collect(Collectors.toSet());

        product.setProductPropertyList(productPropertyList);

        this.productRepository.save(product);
    }
}
