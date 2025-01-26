package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "product_categories")
public class ProductCategory extends DomainObject {
    @JsonIgnore
    public static String ENTITY_NAME = "product category";

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug")
    private String slug;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "productCategory", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    public ProductCategory(String name, String description) {
        this.setName(name);
        this.setDescription(description);
    }
}
