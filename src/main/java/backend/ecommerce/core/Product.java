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
public class Product extends DomainObject{
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

    @CreationTimestamp
    @Column(name = "added_date", nullable = false)
    private Date addedDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "description")
    private String description;

    @Column(name = "weight")
    private Double weight;
}
