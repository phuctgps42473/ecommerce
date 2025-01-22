package backend.ecommerce.core.admin;

import backend.ecommerce.core.admin.dto.ProductDTO;
import backend.ecommerce.core.domain.Product;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("")
    public ResponseEntity<List<ProductDTO>> getAllProducts(@Nullable Pageable pageable) {
        if (pageable == null) {
            pageable = PageRequest.of(1, 30, Sort.by("name"));
        }

        List<ProductDTO> list = this.productService.getAllProducts(pageable);
        return ResponseEntity.ok(list);
    }

    @PostMapping("")
    public ResponseEntity<Void> addNewProduct(@RequestBody ProductDTO dto) {
        this.productService.createNewProduct(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("{productId}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(this.productService.getProductById(productId));
    }

    @PutMapping("{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId, @RequestBody ProductDTO dto) {
        Product product = this.productService.getProductByIdForUpdate(productId);
        this.productService.updateProduct(product, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{productId}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId) {
        this.productService.deleteProductById(productId);
        return ResponseEntity.ok().build();
    }
}
