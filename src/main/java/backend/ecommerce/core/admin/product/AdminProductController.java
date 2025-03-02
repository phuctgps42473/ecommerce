package backend.ecommerce.core.admin.product;

import backend.ecommerce.core.domain.Product;
import backend.ecommerce.core.dto.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
public class AdminProductController {
    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Void>> createNewProduct(@RequestBody NewProductRequest dto) {

        this.adminProductService.createNewProduct(dto);

        return ResponseEntity.ok(ApiResponse.success(200));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<PreviewProductResponse>>> getProductList(Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success(200,
                        this.adminProductService.getProductList(pageable)
                )
        );
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<Product>> getProductList(@PathVariable("productId") Long productId) {
        return ResponseEntity.ok(ApiResponse.success(200, this.adminProductService.getProductById(productId)));
    }

}
