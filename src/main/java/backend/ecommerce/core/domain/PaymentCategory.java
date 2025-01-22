package backend.ecommerce.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "payment_categories")
public class PaymentCategory extends DomainObject {
    @Column(name = "name")
    private PaymentCategoryType paymentCategoryType;
}
