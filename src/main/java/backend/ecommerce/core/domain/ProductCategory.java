package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "product_categories")
@Getter
@Setter
@NoArgsConstructor
public class ProductCategory extends DomainObject {
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "productCategory", fetch = FetchType.LAZY)
    private Set<Product> products = new HashSet<>();
}
