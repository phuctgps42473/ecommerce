package backend.ecommerce.core.product;

import backend.ecommerce.core.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Page<Product> findAllWithPromotions(Pageable pageable);

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

    @Query("""
            select p from Product p
            join p.productVariantList pv
            left join fetch p.promotionProductList pp
            left join fetch pp.promotion pm
            where p.slug = :productSlug
            group by p, pm, pp
            """)
    Optional<Product> findBySlug(@Param("productSlug") String productSlug);

}
