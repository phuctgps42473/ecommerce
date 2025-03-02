package backend.ecommerce.core.order;


import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record CustomerOrderRequest(
        @NotNull long addressId,
        double shipmentFee,
        double totalPrice,
        Set<OrderProduct> products
) {
    record OrderProduct(
            long productId,
            @Nullable Long promotionId,
            Set<OrderVariant> variants
    ) {
        record OrderVariant(
                long variantId,
                double quantity,
                double subtotal
        ) {
        }
    }
}
