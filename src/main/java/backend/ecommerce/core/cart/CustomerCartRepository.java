package backend.ecommerce.core.cart;

import backend.ecommerce.core.domain.CustomerCart;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CustomerCartRepository extends JpaRepository<CustomerCart, Long> {
    int countAllByUserEmail(@NotNull @Email @Size(max = 100) String userEmail);

    @Query("""
            select new backend.ecommerce.core.cart.CartItemResponse(cc.id, pv.id, p.productName, p.slug ,pv.name, pv.image, pv.price, cc.quantity) from CustomerCart cc
            join cc.productVariant pv
            join pv.product p
            where cc.user.email = :userEmail
            """)
    Page<CartItemResponse> findAllByUserEmail(@Param("userEmail") String userEmail, Pageable pageable);

    @Query("""
            select new backend.ecommerce.core.cart.CheckoutItemResponse(cc.id, p.id, pv.id, p.productName, pv.name, pv.image, pv.price, cc.quantity) from CustomerCart cc
            join cc.productVariant pv
            join pv.product p
            where
                cc.user.email = :userEmail and
                pv.id in (:idList)
            """)
    Set<CheckoutItemResponse> findAllByUserEmailInIdList(@Param("userEmail") String userEmail, @Param("idList") List<Long> idList);

    Optional<CustomerCart> findByUserIdAndProductVariantId(Long userId, Long productVariantId);

    @Transactional
    @Modifying
    @Query("""
            delete CustomerCart c
            where
                c.productVariant.id = :productVariantId and
                c.user.id = :userId
            """)
    void deleteByUserIdAndProductVariantId(@Param("userId") Long userId, @Param("productVariantId") Long productVariantId);

    @Transactional
    @Modifying
    @Query("""
            delete CustomerCart c
            where
                c.productVariant.id in (:productVariantIdList) and
                c.user.id = :userId
            """)
    void deleteAllByUserIdAndProductVariantId(@Param("userId") Long userId, @Param("productVariantIdList") List<Long> productVariantIdList);
}
