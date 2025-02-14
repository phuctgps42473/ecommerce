package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "vendor_products")
@Setter
@Getter
@NoArgsConstructor
public class VendorProduct extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = true)
    private Product product;

    @Column(name = "name")
    private String name;

    @Column(name = "brand")
    private String brand;

    @Column(name = "product_gtin")
    private String gtin;

    @OneToMany(mappedBy = "vendorProduct", fetch = FetchType.LAZY)
    private List<VendorProductProperty> vendorProductPropertyList;
}
