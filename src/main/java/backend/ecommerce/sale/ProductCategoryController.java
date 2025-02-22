package backend.ecommerce.sale;

import backend.ecommerce.core.domain.Product;
import backend.ecommerce.core.service.ProductCategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class ProductCategoryController {
    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Page<Product>> getAllProductsOfCategory(@PathVariable("slug") String slug, Pageable pageable) {
        return ResponseEntity.ok(this.productCategoryService.getAllProductsOfCategory(slug, pageable));
    }

}
