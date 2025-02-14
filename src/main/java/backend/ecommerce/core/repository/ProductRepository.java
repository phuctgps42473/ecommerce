package backend.ecommerce.core.repository;

import backend.ecommerce.core.domain.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = """
            select distinct p
            from Product p
            left join fetch p.promotionProductList pp
            left join fetch Promotion pm
            on
             pp.promotion.id = pm.id 
             and pm.isValid = true
             and CURRENT_TIMESTAMP between pm.startDate and pm.endDate
            where p.slug = :slug
            """)
    Product findBySlug(@Param("slug") String slug);

    @Query("""
            select  p
            from Product p
            left join fetch p.promotionProductList pp
            left join fetch Promotion pm
            on
             pp.promotion.id = pm.id 
             and pm.isValid = true
             and CURRENT_TIMESTAMP between pm.startDate and pm.endDate
            where 
                p.stockQuantity >
                    case 
                        when p.productCategory.slug = 'switches' then 20000
                        ELSE 500
                    end
                and
                p.addedDate >= :days
            """)
    List<Product> findHighStockProductsInTheLast(@Param("days") Date days, Pageable pageable);


    @Query("""
           select p
           from Product p
           left join fetch p.promotionProductList pp
           left join fetch Promotion pm
           on
               pp.promotion.id = pm.id 
               and pm.isValid = true
               and CURRENT_TIMESTAMP between pm.startDate and pm.endDate
           join p.orderDetailList od
           on 
               od.product.id = p.id and
               od.order.orderStatus = 'COMPLETE'
           group by p.id, pp.product.id, pp.promotion.id
           order by count(p.id) desc
            """)
    List<Product> findProductsAppearMostInOrders(Pageable pageable);

    @Query("""
            select distinct p
            from Product p
            join fetch PromotionProduct pp
            on p.id = pp.product.id
            join fetch Promotion pm
            on 
                pp.promotion.id = pm.id and
                pm.isValid = true and
                current_date between pm.startDate and pm.endDate
            """)
    List<Product> findOnSaleProducts(Pageable pageable);

    @Query("""
            select p
            from Product p
            left join fetch PromotionProduct pp
            on p.id = pp.product.id
            left join fetch Promotion pm
            on 
                pp.promotion.id = pm.id 
                and pm.isValid = true
                and CURRENT_TIMESTAMP between pm.startDate and pm.endDate
            where p.productCategory.slug = :slug
            """)
    List<Product> findAllByProductCategorySlug(@Param("slug") String slug, Pageable pageable);



}
