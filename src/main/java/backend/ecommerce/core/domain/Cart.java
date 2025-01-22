package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "carts")
public class Cart {
    @EmbeddedId
    private CartId id;

    @MapsId("user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false, nullable = false)
    private User user;

    @MapsId("product_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false, nullable = false)
    private Product product;

    @Column(name = "product_quantity")
    private Integer productQuantity;

    @Embeddable
    @Data
    public static class CartId implements Serializable {
        @Column(name = "user_id")
        private Long user_id;

        @Column(name = "product_id")
        private Long product_id;
    }
}
