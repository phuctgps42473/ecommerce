package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "customer_orders")
@Getter
@Setter
@NoArgsConstructor
public class CustomerOrder extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "customerOrder")
    private List<CustomerOrderDetail> customerOrderDetailList;

    @Column(name = "shipment_fee")
    private Double shipmentFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private CustomerOrderStatus customerOrderStatus;

    @Column(name = "total_price")
    private Double totalPrice;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
}
