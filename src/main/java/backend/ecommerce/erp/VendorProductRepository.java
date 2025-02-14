package backend.ecommerce.erp;

import backend.ecommerce.core.domain.VendorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorProductRepository extends JpaRepository<VendorProduct, Long> {
}
