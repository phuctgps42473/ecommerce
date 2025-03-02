package backend.ecommerce.sale;

import backend.ecommerce.core.domain.Product;
import backend.ecommerce.core.service.ProductService;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicProductDetailController {
    private static final Logger log = LoggerFactory.getLogger(PublicProductDetailController.class);
    private final ProductService productService;

    public PublicProductDetailController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products/{productSlug}")
    public ResponseEntity<Product> getProductDetailBySlug(
            @PathVariable("productSlug") String productSlug
    ) {
        log.info("Finding product with slug: {}", productSlug);
        return ResponseEntity.ok(this.productService.getProductBySlug(productSlug));
    }

    @GetMapping("/products/same-brand-products")
    public ResponseEntity<Page<PreviewProductDTO>> getProductsFromTheSameBrand(
            @NotNull @RequestParam("brand") String brand,
            @NotNull @RequestParam("id") Long id,
            Pageable pageable
    ) {
        log.info("Finding Products the same brand with product id: {}", id);
        return ResponseEntity.ok(this.productService.getProductsFromTheSameBrandAsProductId(brand, id, pageable));
    }
}
