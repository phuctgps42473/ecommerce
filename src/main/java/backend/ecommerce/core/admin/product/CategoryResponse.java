package backend.ecommerce.core.admin.product;

public record CategoryResponse(
        long id,
        String categoryName,
        String slug,
        String description
) {
}
