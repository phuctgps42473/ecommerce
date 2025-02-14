package backend.ecommerce.core.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants")
public class ProductVariant extends DomainObject {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "name")
    private String name;

    @Column(name = "image")
    private String image;

    @Column(name = "price")
    private Double price;

    @Column(name = "weight")
    private Double weight;

    // Dimensions in millimeter
    // {width: 300, length:400, height: 500 }
    @Column(name = "dimensions_mm")
    private String dimensionsMM;

    @Column(name = "sku")
    private String sku;

    @Column(name = "stock")
    private Double stock;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "productVariant")
    private List<ProductVariantDetail> productVariantDetailList = new ArrayList<>();
}
