package backend.ecommerce.core.admin.product;

public record PropertyResponse(
        long id,
        long productCategoryId,
        String propertyName,
        String propertyValue
) {
}
