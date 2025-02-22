package backend.ecommerce.core.cart;

public record CartDTO(
        Long productVariantId,
        Double quantity
) {}
