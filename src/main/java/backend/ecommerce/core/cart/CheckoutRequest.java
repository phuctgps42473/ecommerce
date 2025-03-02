package backend.ecommerce.core.cart;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CheckoutRequest(
        @JsonProperty("checkoutItemList") List<Long> checkoutItemIdList
) {
}
