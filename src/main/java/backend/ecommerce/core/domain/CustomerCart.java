package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer_carts")
@Getter
@Setter
@NoArgsConstructor
public class CustomerCart extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false, nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", insertable = false, updatable = false, nullable = false)
    private ProductVariant productVariant;

    @Column(name = "quantity")
    private Integer quantity;
}
