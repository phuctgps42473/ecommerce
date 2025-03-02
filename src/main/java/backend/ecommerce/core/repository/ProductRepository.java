package backend.ecommerce.core.repository;

import backend.ecommerce.core.admin.product.PreviewProductResponse;
import backend.ecommerce.core.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
            select p from Product p
            join p.productCategory pc
            join p.productVariantList pv
            left join fetch p.promotionProductList pp
            left join fetch pp.promotion pm
            where pc.slug = :slug
            """)
    Page<Product> findAllByCategorySlug(@Param("slug") String slug, Pageable pageable);

    @Query("""
            select p from Product p
            join p.productVariantList pv
            left join fetch p.promotionProductList pp
            left join fetch pp.promotion pm
            where
                p.productBrand = upper(:brand) and
                p.id != :productId
            """)
    Page<Product> findAllByBrandExceptProductId(String brand, Long productId, Pageable pageable);

    @Query("""
            select p from Product p
            join p.productVariantList pv
            join fetch p.promotionProductList pp
            join fetch pp.promotion pm
            """)
    Page<Product> findAllHavePromotions(Pageable pageable);

    @Query("""
            select p from Product  p
            join p.productVariantList pv
            left join fetch p.promotionProductList pp
            left join fetch pp.promotion pm
            where pv.id in (
                    select pv.id from ProductVariant pv
                    join CustomerOrderDetail co
                    on co.productVariant.id = pv.id
                    group by pv
                    order by sum(co.quantity)
            )
            """)
    Page<Product> findAllByMostOrdered(@Param("date") LocalDateTime date, Pageable pageable);

    @Query("""
            select p from Product  p
            join p.productVariantList pv
            left join fetch p.promotionProductList pp
            left join fetch pp.promotion pm
            where p.createdAt > :date
            """)
    Page<Product> findAllAddedAfter(@Param("date") LocalDate date, Pageable pageable);

    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD, attributePaths = {"productVariantList", "productPropertyList", "productPropertyList.property", "promotionProductList", "promotionProductList.promotion"})
    Optional<Product> findBySlug(@Param("productSlug") String productSlug);

    @Query("""
            select new backend.ecommerce.core.admin.product.PreviewProductResponse(p.id, pc.name,p.productName,p.totalStock) from Product  p
            join p.productCategory pc
            """)
    Page<PreviewProductResponse> findAllAdminPreviewProduct(Pageable pageable);
}
