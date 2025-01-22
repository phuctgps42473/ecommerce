package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "transactions")
public class Transaction  extends DomainObject{
    @Column(name = "payment_gateway_transaction_id", unique = true)
    private String paymentGatewayTransactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    private TransactionCategory transactionCategory;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Column(name = "ammount")
    private Double ammount;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
}
