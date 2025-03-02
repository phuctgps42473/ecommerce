package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Table(name = "product_properties")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class ProductProperty {
    @EmbeddedId
    @JsonIgnore
    private ProductPropertyId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    @MapsId("productId")
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"id", "productPropertyList"})
    @MapsId("propertyId")
    private Property property;

    public ProductProperty(Product product, Property property) {
        this.id = new ProductPropertyId();
        this.product = product;
        this.property = property;
    }

    @Embeddable
    @Setter
    @Getter
    public static class ProductPropertyId implements Serializable {
        @Column(name = "product_id")
        private Long productId;

        @Column(name = "property_id")
        private Long propertyId;
    }
}
