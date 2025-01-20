package backend.ecommerce.core.repository;

import backend.ecommerce.core.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Long, Product> {
}
