package backend.ecommerce.core.order;

import backend.ecommerce.core.domain.CustomerOrder;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    @Query("""
            select co from CustomerOrder co
            join fetch co.user u
            join fetch co.customerOrderDetailList col
            join fetch col.productVariant pv
            join fetch pv.product p
            where co.user.email = :email
            order by co.createdAt
            """)
    Page<CustomerOrder> findAllByCustomerEmail(@Param("email") String email, Pageable pageable);

    @Query("""
            select new backend.ecommerce.core.admin.order.PreviewOrderResponse(o.id, o.customerOrderStatus,o.totalPrice, o.createdAt) from CustomerOrder o
            """)

    @NotNull
    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD, attributePaths = {"user", "address", "customerOrderDetailList","customerOrderDetailList.promotion"})
    Page<CustomerOrder> findAll(@NotNull Pageable pageable);

    @NotNull
    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD, attributePaths = {"user", "address", "customerOrderDetailList","customerOrderDetailList.promotion"})
    Optional<CustomerOrder> findById(@NotNull Long orderId);
}
