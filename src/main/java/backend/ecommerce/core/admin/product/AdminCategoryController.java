package backend.ecommerce.core.admin.product;

import backend.ecommerce.core.domain.ProductCategory;
import backend.ecommerce.core.dto.ApiResponse;
import backend.ecommerce.core.service.ProductCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminCategoryController {
    private final ProductCategoryService productCategoryService;

    public AdminCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping("/products/new/categories")
    public ApiResponse<List<CategoryForProductCreationResponse>> getCategoryList() {
        return ApiResponse.success(200, this.productCategoryService.getCategoryListForProductCreation());
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> getCategoryListForView() {
        return ApiResponse.success(200, this.productCategoryService.getAllCategoryList());
    }
}
