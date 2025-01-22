package backend.ecommerce.core.admin;

import backend.ecommerce.core.domain.Product;
import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.admin.dto.ProductDTO;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductCategoryRepository;
import backend.ecommerce.core.repository.ProductRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
        this.productRepository = productRepository;
    }

    public List<ProductDTO> getAllProducts(Pageable pageable) {
        return this.productRepository.findAll(pageable).map(product ->
                new ProductDTO(product.getId(), product.getProductCategory() == null ? null : product.getProductCategory().getId(), product.getProductName(), product.getPrice(), product.getCostPrice(), product.getSku(), product.getStockQuantity(), product.getDescription(), product.getWeight())
        ).toList();
    }

    public ProductDTO getProductById(Long id) {
        return this.productRepository
                .findById(id)
                .map(product -> new ProductDTO(
                        product.getId(),
                        product.getProductCategory().getId(),
                        product.getProductName(),
                        product.getPrice(),
                        product.getCostPrice(),
                        product.getSku(),
                        product.getStockQuantity(),
                        product.getDescription(),
                        product.getWeight()
                ))
                .orElseThrow(() -> new ResourceNotFoundException(Product.ENTITY_NAME, id));
    }

    public Product getProductByIdForUpdate(Long id) {
        return this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(Product.ENTITY_NAME, id));
    }

    public Product createNewProduct(ProductDTO dto) {
        ProductCategory productCategory = null;
        if (dto.productCategoryId() != null) {
            productCategory = this.productCategoryRepository.findById(dto.productCategoryId()).orElseThrow(() -> new ResourceNotFoundException(ProductCategory.ENTITY_NAME, dto.productCategoryId()));
        }

        Product product = new Product();
        product.setProductCategory(productCategory);
        product.setProductName(dto.productName());
        product.setPrice(dto.price());
        product.setCostPrice(dto.costPrice());
        product.setSku(dto.sku());
        product.setStockQuantity(dto.stockQuantity());
        product.setDescription(dto.description());
        product.setWeight(dto.weight());

        return saveProduct(product);
    }

    public Product updateProduct(Product product, ProductDTO dto) {
        ProductCategory productCategory = null;
        if (dto.productCategoryId() != null) {
            productCategory = this.productCategoryRepository.findById(dto.productCategoryId()).orElseThrow(() -> new ResourceNotFoundException(ProductCategory.ENTITY_NAME, dto.productCategoryId()));
        }

        product.setProductCategory(productCategory);
        product.setProductName(dto.productName());
        product.setPrice(dto.price());
        product.setCostPrice(dto.costPrice());
        product.setSku(dto.sku());
        product.setStockQuantity(dto.stockQuantity());
        product.setDescription(dto.description());
        product.setWeight(dto.weight());

        return saveProduct(product);
    }

    public void deleteProductById(Long productId) {
        this.productRepository.deleteById(productId);
    }

    private Product saveProduct(Product product) {
        return this.productRepository.save(product);
    }


}
