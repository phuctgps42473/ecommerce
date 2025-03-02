package backend.ecommerce.core.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "product_properties")
public class ProductProperty extends DomainObject {
    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "property_value")
    private String propertyValue;
}
