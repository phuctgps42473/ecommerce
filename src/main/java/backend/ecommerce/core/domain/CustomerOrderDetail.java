package backend.ecommerce.core.domain;

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
    private OrderDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_order_id")
    private CustomerOrder customerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "subtotal")
    private Double subtotal;

    @Data
    @Embeddable
    public static class OrderDetailId implements Serializable {
        @Column(name = "order_id")
        private Long order_id;

        @Column(name = "product_id")
        private Long product_id;
    }
}
