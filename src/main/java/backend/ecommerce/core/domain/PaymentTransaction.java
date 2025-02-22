package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name = "payment_transactions")
@Setter
@Getter
@NoArgsConstructor
public class PaymentTransaction extends DomainObject {
    @Column(name = "payment_gateway_transaction_id", unique = true)
    private String paymentGatewayTransactionId;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "payment_transaction_type")
    private PaymentTransactionType paymentTransactionType;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "status")
    private PaymentTransactionStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "amount")
    private Double amount;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
}
