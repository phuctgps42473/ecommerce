package backend.ecommerce.core.admin.dto;

import java.util.Map;

public record NewProductRequest(
         Long categoryId,
         Long brandId,
         String productName,
         String sku,
         Double weight,
         String description,
         Double costPrice,
         Double price,
         Integer stock,
         String imageUrl,
         Map<String, String> details
) {
}
