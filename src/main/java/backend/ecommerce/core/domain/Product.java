package backend.ecommerce.core.domain;

import backend.ecommerce.core.admin.dto.NewProductRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Table(name = "products")
@Entity
@Getter @Setter
@NoArgsConstructor
public class Product extends DomainObject {
    @JsonIgnore
    public String ENTITY_NAME = "product";

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private ProductCategory productCategory;

    @JoinColumn(name = "product_brand")
    private String productBrand;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "product_profile_image")
    private String productProfileImage;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDate created_at;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> productVariantList = new ArrayList<>();
}