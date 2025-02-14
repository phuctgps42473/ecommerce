package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "order_details")
public class OrderDetail {
    @EmbeddedId
    private OrderDetailId id;

    @MapsId("order_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @MapsId("product_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_quantity")
    private Integer productQuantity;

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
