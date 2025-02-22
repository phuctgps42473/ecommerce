package backend.ecommerce.sale;

import backend.ecommerce.core.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicProductController {
    public ProductService productService;

    public PublicProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products/on-sale-products")
    public ResponseEntity<Page<PreviewProductDTO>> getAllSaleProducts(
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(this.productService.getOnSaleProducts(pageable));
    }

    @GetMapping("/products/hot-products")
    public ResponseEntity<Page<PreviewProductDTO>> getHotProducts(
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(this.productService.getHotProducts(pageable));
    }

    @GetMapping("/products/new-arrivals")
    public ResponseEntity<Page<PreviewProductDTO>> getNewArrivals(
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(this.productService.getNewArrivals(pageable));
    }

    @GetMapping("/categories/{categorySlug}")
    public ResponseEntity<Page<PreviewProductDTO>> getProductDetailByCategorySlug(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @PathVariable("categorySlug") String categorySlug
    ) {
        return ResponseEntity.ok(this.productService.getProductsByCategorySlug(categorySlug, pageable));
    }
}
