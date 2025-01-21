package backend.ecommerce.core.admin;

import backend.ecommerce.core.dto.ProductCategoryDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/product-categories")
public class AdminProductCategoryController {
    public ProductCategoryService productCategoryService;

    @PostMapping("create")
    public ResponseEntity<Void> createNewCategory(@RequestBody ProductCategoryDTO form) {


        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
