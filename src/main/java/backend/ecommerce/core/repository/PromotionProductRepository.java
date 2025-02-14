package backend.ecommerce.core.repository;

import backend.ecommerce.core.domain.PromotionProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionProductRepository extends JpaRepository<PromotionProduct, Long> {

}
