package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
public class PurchaseOrder extends DomainObject {
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "status")
    private String orderStatus;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDateTime expectedDeliveryDate;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "purchaseOrder")
    private List<PurchaseOrderDetail> purchaseOrderDetail;
}
