package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "customer_orders")
@Getter
@Setter
@NoArgsConstructor
public class CustomerOrder extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "customerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CustomerOrderDetail> customerOrderDetailList;

    @Column(name = "shipment_fee")
    private Double shipmentFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private CustomerOrderStatus customerOrderStatus;

    @Column(name = "total_price")
    private Double totalPrice;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDate updatedAt;

    public CustomerOrder(User user, Address address, double shipmentFee, double totalPrice, Set<CustomerOrderDetail> customerOrderDetailList) {
        this.user = user;
        this.address = address;
        this.customerOrderDetailList = customerOrderDetailList;
        this.shipmentFee = shipmentFee;
        this.customerOrderStatus = CustomerOrderStatus.PREPARING;
        this.totalPrice = totalPrice;
    }
}
