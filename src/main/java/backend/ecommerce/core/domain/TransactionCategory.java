package backend.ecommerce.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "transaction_categories")
@Data
public class TransactionCategory extends DomainObject{
    @Column(name = "name")
    private TransactionCategoryType name;
}
