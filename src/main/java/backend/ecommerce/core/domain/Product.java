package backend.ecommerce.core;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;


@EqualsAndHashCode(callSuper = true)
@Data
@Table(name = "products")
@Entity
public class Product extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory productCategory;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "cost_price", nullable = false)
    private Double costPrice;

    @Column(name = "sku", nullable = false)
    private String sku;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "description")
    private String description;

    @Column(name = "weight")
    private Double weight;

    @CreationTimestamp
    @Column(name = "added_date", nullable = false)
    private Date addedDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;


    public Product(ProductCategory productCategory, String productName, Double price, Double costPrice, String sku,
                   int stockQuantity, String description, Double weight) {
        this.setProductCategory(productCategory);
        this.setProductName(productName);
        this.setPrice(price);
        this.setCostPrice(costPrice);
        this.setSku(sku);
        this.setStockQuantity(stockQuantity);
        this.setDescription(description);
        this.setWeight(weight);
    }
}
