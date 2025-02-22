package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private ProductCategory productCategory;

    @Column(name = "product_brand")
    private String productBrand;

    @Column(name = "total_stock")
    private Double totalStock = 0.0;

    @Column(name = "product_name", nullable = false)
    private String productName;

    // Dimensions in millimeter
    // {width: 300, length:400, height: 500 }
    @Column(name = "dimensions_mm")
    private String dimensionsMM;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "product_profile_image")
    private String productProfileImage;

    @Column(name = "description", length = 1000)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PromotionProduct> promotionProductList = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> productVariantList = new ArrayList<>();
}