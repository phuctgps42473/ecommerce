package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
public class Promotion extends DomainObject {
    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "promotion_type", length = 20)
    private PromotionType promotionType;

    @Column(name = "promotion_value")
    private double promotionValue;

    @Column(name = "is_valid")
    private boolean isValid = false;

    @OneToMany(mappedBy = "promotion", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PromotionProduct> promotionProductList;

    public enum PromotionType {
        MONEY,
        PERCENTAGE
    }
}
