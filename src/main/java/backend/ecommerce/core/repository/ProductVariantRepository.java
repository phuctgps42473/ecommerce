package backend.ecommerce.core.repository;

import backend.ecommerce.core.domain.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Query("""
            select pv.stock from ProductVariant pv
            where
                pv.id = :id
            """)
    Optional<Double> findStockByVariantId(Long id);
}
