package backend.ecommerce.core.admin;

import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.dto.ProductCategoryDTO;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/admin/product-categories")
public class ProductCategoryController {
    public ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @PostMapping("")
    public ResponseEntity<Void> createNewCategory(@RequestBody ProductCategoryDTO form) {
        this.productCategoryService.createNewProductCategory(form);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("")
    // api/admin/product-categories?page=?&size=?
    public ResponseEntity<List<ProductCategoryDTO>> getProductCategories(@Nullable Pageable pageable) {
        if (pageable == null) {
            pageable = PageRequest.of(1, 10);
        }
        List<ProductCategoryDTO> productCategories =  this.productCategoryService.getProductCategories(pageable);
        return ResponseEntity.of(Optional.ofNullable(productCategories));
    }

    @GetMapping("{productCategoryId}")
    public ResponseEntity<ProductCategoryDTO> getProductCategory(@PathVariable Long productCategoryId) {
        ProductCategoryDTO productCategory =  this.productCategoryService.getProductCategoryById(productCategoryId);
        return ResponseEntity.ok(productCategory);
    }


    @PutMapping("{productCategoryId}")
    public ResponseEntity<ProductCategoryDTO> updateProductCategory(@PathVariable Long productCategoryId, @RequestBody ProductCategoryDTO dto) {
        ProductCategory currentProductCategory = this.productCategoryService.getProductCategoryForUpdate(productCategoryId);
        this.productCategoryService.updateProductCategory(currentProductCategory, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{productCategoryId}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable Long productCategoryId) {
        this.productCategoryService.deleteProductCategoryById(productCategoryId);
        return ResponseEntity.ok().build();
    }
}
