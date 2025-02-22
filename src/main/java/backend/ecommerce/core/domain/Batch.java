package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "batches")
@Setter
@Getter
@NoArgsConstructor
public class Batch extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(name = "unit")
    private String unit;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "mfg")
    private LocalDateTime mfg;

    @Column(name = "warranty_period_in_months")
    private Integer warrantyPeriodInMonths;

    @Column(name = "warehouse")
    private String warehouse;

    @CreationTimestamp
    @Column(name = "batch_date")
    private LocalDateTime batchDate;
}
