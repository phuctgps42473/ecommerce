package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_categories")
@Getter
@Setter
@NoArgsConstructor
public class ProductCategory extends DomainObject {
    @JsonIgnore
    public String ENTITY_NAME = "product category";

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false)
    private ProductCategoryType name;

    @Column(name = "slug")
    private String slug;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "productCategory", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    public ProductCategory(ProductCategoryType name, String description) {
        this.setName(name);
        this.setDescription(description);
    }
}
