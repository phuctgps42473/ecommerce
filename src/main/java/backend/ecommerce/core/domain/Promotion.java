package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
public class Promotion extends DomainObject {
    @Column(name = "name")
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
    @JsonIgnore
    private boolean isValid = false;

    @OneToMany(mappedBy = "promotion", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<PromotionProduct> promotionProductList;

    public enum PromotionType {
        MONEY,
        PERCENTAGE
    }
}
