package backend.ecommerce.core.admin.product;

import backend.ecommerce.core.dto.ApiResponse;
import jakarta.annotation.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminPropertyController {
    private final PropertyService propertyService;

    public AdminPropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping("/properties")
    public ResponseEntity<ApiResponse<Void>> addNewProperty(
            @RequestBody NewPropertyRequest dto
    ) {
        this.propertyService.addNewProperty(dto);
        return new ResponseEntity<>(ApiResponse.success(201), HttpStatusCode.valueOf(201));
    }

    @GetMapping("/properties")
    public ResponseEntity<ApiResponse<Object>> getPropertyList(
            @Nullable @RequestParam(name = "categoryId") Long categoryId
    ) {
        if (categoryId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST, "Category id must be provided"));
        }
        return ResponseEntity.ok(ApiResponse.success(200, this.propertyService.getPropertyListByProductCategoryId(categoryId)));
    }
}
