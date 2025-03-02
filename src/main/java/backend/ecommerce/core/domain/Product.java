package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;


@Table(name = "products")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    @JsonIgnore
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonIgnore
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PromotionProduct> promotionProductList = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductProperty> productPropertyList = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductVariant> productVariantList = new HashSet<>();

    public Product(ProductCategory productCategory, String productBrand, Double totalStock, String productName, String dimensionsMM, Double weight, String slug, String productProfileImage, String description) {
        this.productCategory = productCategory;
        this.productBrand = productBrand;
        this.totalStock = totalStock;
        this.productName = productName;
        this.dimensionsMM = dimensionsMM;
        this.weight = weight;
        this.slug = makeSlug(productName);
        this.productProfileImage = productProfileImage;
        this.description = description;
    }

    private static String makeSlug(String productName) {
        String id = UUID.randomUUID().toString();
        String name = productName.toLowerCase().replaceAll(" ", "-");
        return name + id;
    }
}