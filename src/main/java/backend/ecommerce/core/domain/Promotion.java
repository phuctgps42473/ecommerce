package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "promotions")
public class Promotion extends DomainObject {
    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "start_date")
    private ZonedDateTime startDate;

    @Column(name = "end_date")
    private ZonedDateTime endDate;

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
