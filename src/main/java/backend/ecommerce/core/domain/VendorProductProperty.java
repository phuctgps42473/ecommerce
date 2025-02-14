package backend.ecommerce.core.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "vendor_product_properties")
public class VendorProductProperty extends DomainObject{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_product_id")
    private VendorProduct vendorProduct;

    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "property_value")
    private String propertyValue;
}
