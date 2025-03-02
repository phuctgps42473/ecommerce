package backend.ecommerce.core.admin.product;

public record PreviewProductResponse(
        long id,
        String productCategory,
        String productName,
        double totalStock
) {
}
