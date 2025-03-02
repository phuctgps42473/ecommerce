package backend.ecommerce.core.admin.order;

import backend.ecommerce.core.domain.CustomerOrder;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.order.CustomerOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminCustomerOrderService {
    private final CustomerOrderRepository customerOrderRepository;

    public AdminCustomerOrderService(CustomerOrderRepository customerOrderRepository) {
        this.customerOrderRepository = customerOrderRepository;
    }

    public Page<CustomerOrder> getCustomerOrderList(Pageable pageable) {
        return this.customerOrderRepository.findAll(pageable);
    }

    public CustomerOrder getCustomerOrderById(Long orderId) {
        return this.customerOrderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("No Order Found For ID: " + orderId));
    }
}
