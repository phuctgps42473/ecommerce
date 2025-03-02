package backend.ecommerce.core.admin.order;

import backend.ecommerce.core.domain.CustomerOrderStatus;

import java.time.LocalDate;

public record PreviewOrderResponse(
        long orderId,
        CustomerOrderStatus orderStatus,
        double totalPrice,
        LocalDate createdAt
) {
}
