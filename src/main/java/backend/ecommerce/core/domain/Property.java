package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "properties")
@Setter
@Getter
public class Property extends DomainObject {
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductProperty> productPropertyList = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_category_id")
    @JsonIgnore
    private ProductCategory productCategory;

    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "property_value")
    private String propertyValue;

    public Property(ProductCategory productCategory, String propertyName, String propertyValue) {
        this.productCategory = productCategory;
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
    }
}
