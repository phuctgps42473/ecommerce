package backend.ecommerce.vendor.repository;

import backend.ecommerce.vendor.domain.VendorProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorProductRepository extends JpaRepository<VendorProduct, Long> {
    @Query("""
            select vp from VendorProduct vp
            join fetch vp.vendor v
            join fetch vp.product p
            where vp.vendor.id = :vendorId
            """)
    Page<VendorProduct> findByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);

    Page<VendorProduct> findByGtin(String gtin, Pageable pageable);

    @Query("""
            select vp from VendorProduct vp
            where vp.id = :productId and
            vp.vendor.id = :vendorId
            """)
    Optional<VendorProduct> findByIdAndVendorId(@Param("vendorId") Long productId, @Param("vendorId") Long vendorId);
}
