package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_transactions")
@Setter
@Getter
@NoArgsConstructor
public class VendorTransaction extends DomainObject {
    @OneToOne(fetch = FetchType.LAZY)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;
}
