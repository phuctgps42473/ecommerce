package backend.ecommerce.core.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "product_variant_details")
public class ProductVariantDetail extends DomainObject {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(name = "variant_property")
    private String variantProperty;

    @Column(name = "variant_value")
    private String variantValue;
}
