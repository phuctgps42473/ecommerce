package backend.ecommerce.core.admin.product;

// TODO: CHANGE NAME!
public record NewPropertyRequest(
        Long productCategoryId,
        String propertyName,
        String propertyValue
) {
}
