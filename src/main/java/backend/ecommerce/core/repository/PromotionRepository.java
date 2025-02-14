package backend.ecommerce.core.repository;

import backend.ecommerce.core.domain.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
//
//    @Query("""
//            select pm from Promotion pm
//            left join PromotionProduct pp
//            on pm.id = pp.promotion.id
//            left join Product p
//            on p.id = pp.product.id
//            where now() between pm.startDate and pm.endDate
//            and pm.isValid = true
//            and p.slug = :slug
//            """)
//    Promotion findValidByProductSlug(@Param("slug") String slug);
}
