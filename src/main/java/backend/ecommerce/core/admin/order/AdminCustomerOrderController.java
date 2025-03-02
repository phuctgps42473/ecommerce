package backend.ecommerce.core.admin.order;

import backend.ecommerce.core.domain.CustomerOrder;
import backend.ecommerce.core.dto.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.simpleframework.xml.Path;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminCustomerOrderController {
    private final AdminCustomerOrderService adminCustomerOrderService;

    public AdminCustomerOrderController(AdminCustomerOrderService adminCustomerOrderService) {
        this.adminCustomerOrderService = adminCustomerOrderService;
    }

    @GetMapping("orders")
    public ResponseEntity<ApiResponse<Page<CustomerOrder>>> getCustomerOrderList(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(200, this.adminCustomerOrderService.getCustomerOrderList(pageable)));
    }

    @GetMapping("orders/{orderId}")
    public ResponseEntity<ApiResponse<CustomerOrder>> getCustomerOrderList(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(200, this.adminCustomerOrderService.getCustomerOrderById(orderId)));
    }

}
