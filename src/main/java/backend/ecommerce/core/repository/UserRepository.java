package backend.ecommerce.core.repository;

import backend.ecommerce.core.domain.User;
import backend.ecommerce.core.dto.UserInfoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
            select new backend.ecommerce.core.dto.UserInfoDTO(u.fullname,u.email, u.phoneNumber,u.imageUrl) from User u
            where u.email = :email
            """)
    Optional<UserInfoDTO> findUserInfoDTOByEmail(@Param("email") String email);
}
