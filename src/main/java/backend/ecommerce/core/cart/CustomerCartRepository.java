package backend.ecommerce.core.cart;

import backend.ecommerce.core.domain.CustomerCart;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerCartRepository extends JpaRepository<CustomerCart, Long> {
    int countAllByUserEmail(@NotNull @Email @Size(max = 100) String userEmail);

    @Query("""
            select cc from CustomerCart cc
            join fetch cc.productVariant pv
            where cc.user.email = :userEmail
            """)
    Page<CustomerCart> findAllByUserId(@Param("userEmail") String userEmail, Pageable pageable);

    Optional<CustomerCart> findByUserIdAndProductVariantId(Long userId, Long productVariantId);
}
