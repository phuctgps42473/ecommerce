package backend.ecommerce.core.cart;

public record CartItemResponse(
        long cartItemId,
        long productVariantId,
        String productName,
        String productSlug,
        String variantName,
        String image,
        double price,
        double quantity
) {
}
