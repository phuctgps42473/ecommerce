package backend.ecommerce.core.cart;

import backend.ecommerce.core.domain.Promotion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItemResponse {
    private long cartItemId;
    private long productId;
    private long productVariantId;
    private String productName;
    private String productVariantName;
    private String image;
    private double price;
    private double quantity;
    private Set<Promotion> promotionList;

    public CheckoutItemResponse(long cartItemId, long productId, long productVariantId, String productName, String productVariantName, String image, double price, double quantity) {
        this.cartItemId = cartItemId;
        this.productId = productId;
        this.productVariantId = productVariantId;
        this.productName = productName;
        this.productVariantName = productVariantName;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }
}
