package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;


@Entity
@Table(name = "promotion_products")
@Setter
@Getter
@NoArgsConstructor
public class PromotionProduct {
    @EmbeddedId
    private PromotionProductId Id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", insertable = false, updatable = false)
    private Promotion promotion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Setter
    @Getter
    @Embeddable
    public static class PromotionProductId implements Serializable {
        @Column(name = "promotion_id")
        private long promotionId;

        @Column(name = "product_id")
        private long productId;
    }
}
