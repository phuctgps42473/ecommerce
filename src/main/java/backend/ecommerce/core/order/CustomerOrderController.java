package backend.ecommerce.core.order;

import backend.ecommerce.core.domain.CustomerOrder;
import backend.ecommerce.core.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class CustomerOrderController {
    private final CustomerOrderService customerOrderService;

    public CustomerOrderController(CustomerOrderService customerOrderService) {
        this.customerOrderService = customerOrderService;
    }

    @GetMapping("")
    public ResponseEntity<Page<CustomerOrder>> getAllOrders(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return ResponseEntity.ok(this.customerOrderService.getOrderListByEmail(email, pageable));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<Map<String, Long>>> createOrder(
            @Valid @RequestBody CustomerOrderRequest dto
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long orderId = this.customerOrderService.handleNewOrder(email, dto);
        return ResponseEntity.ok(ApiResponse.success(201, Map.of("orderId", orderId)));
    }

}
