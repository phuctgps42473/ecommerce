package backend.ecommerce.vendor.domain;

import backend.ecommerce.core.domain.DomainObject;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_properties")
public class ProductProperty  extends DomainObject {
    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "productProperty")
    List<VendorProductProperty> vendorProductPropertyList = new ArrayList<>();

    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "property_value")
    private String propertyValue;
}
