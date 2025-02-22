package backend.ecommerce.vendor.repository;

import backend.ecommerce.vendor.domain.VendorProductProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorProductPropertyRepository extends JpaRepository<VendorProductProperty, Long> {}
