package backend.ecommerce.vendor.domain;

import backend.ecommerce.core.domain.DomainObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vendor_product_properties")
@Setter
@Getter
@NoArgsConstructor
public class VendorProductProperty {
    @EmbeddedId
    private VendorProductPropertyId vendorProductPropertyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_product_id", insertable = false, updatable = false)
    @JsonIgnore
    private VendorProduct vendorProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_property_id", insertable = false, updatable = false)
    @JsonIgnore
    private ProductProperty productProperty;

    @Embeddable
    @Setter
    @Getter
    public class VendorProductPropertyId {
        @Column(name = "vendor_product_id")
        private Long vendorProductId;

        @Column(name = "product_property_id")
        private Long productPropertyId;
    }
}
