package backend.ecommerce.core.domain;

import backend.ecommerce.vendor.domain.VendorProduct;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "purchase_order_details")
@Setter
@Getter
@NoArgsConstructor
public class PurchaseOrderDetail extends DomainObject {
    @ManyToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_product_id")
    private VendorProduct vendorProduct;

    @Column(name = "unit")
    private String unit;

    @Column(name = "vendor_price")
    private Double vendorPrice;

    @Column(name = "quantity")
    private Integer quantity;
}
