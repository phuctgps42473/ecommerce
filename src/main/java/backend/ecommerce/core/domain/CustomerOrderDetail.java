package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "customer_order_details")
@Setter @Getter
@NoArgsConstructor
public class CustomerOrderDetail {
    @EmbeddedId
    @JsonIgnore
    private OrderDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_order_id", insertable = false, updatable = false)
    @MapsId("customerOrderId")
    @JsonIgnore
    private CustomerOrder customerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", insertable = false, updatable = false)
    @MapsId("productVariantId")
    @JsonIncludeProperties({"id", "name", "sku", "gtin", "image", "price"})
    private ProductVariant productVariant;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "subtotal")
    private Double subtotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    public CustomerOrderDetail(CustomerOrder order, ProductVariant productVariant, Double quantity, Promotion promotion) {
        this.id = new OrderDetailId();
        this.customerOrder = order;
        this.productVariant = productVariant;
        this.quantity = quantity;
        this.subtotal = quantity * productVariant.getPrice();
        this.promotion = promotion;
    }

    @Data
    @Embeddable
    public static class OrderDetailId implements Serializable {
        @Column(name = "customer_order_id")
        private Long customerOrderId;

        @Column(name = "product_variant_id")
        private Long productVariantId;
    }
}
