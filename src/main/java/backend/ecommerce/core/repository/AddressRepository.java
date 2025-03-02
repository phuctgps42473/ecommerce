package backend.ecommerce.core.repository;

import backend.ecommerce.core.domain.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    @Query("""
            select a from Address a
            where
                a.id = :addressId and
                a.user.id = :userId
            """)
    Optional<Address> findByAddressIdAndUserId(@Param("addressId") long addressId, @Param("userId") long userId);

    @Query("""
            select a from Address a
            join a.user u
            where u.email = :email
            """)
    Set<Address> findAllByUserEmail(String email);
}
