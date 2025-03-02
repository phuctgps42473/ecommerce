package backend.ecommerce.core.order;

import backend.ecommerce.core.domain.CustomerOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerOrderDetailRepository extends JpaRepository<CustomerOrderDetail, CustomerOrderDetail.OrderDetailId> {
}
