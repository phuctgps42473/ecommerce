package backend.ecommerce.core.cart;

import backend.ecommerce.core.domain.CustomerCart;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CustomerCartController {
    private static final Logger log = LoggerFactory.getLogger(CustomerCartController.class);
    private final CustomerCartService customerCartService;

    public CustomerCartController(CustomerCartService customerCartService) {
        this.customerCartService = customerCartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addItemToCart(@Valid @RequestBody CartDTO cartDTO) {
        if (cartDTO.quantity() <= 0.0) {
            return ResponseEntity.badRequest().build();
        }
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        this.customerCartService.addItemToCardOfUserEmail(userEmail, cartDTO.productVariantId(), cartDTO.quantity());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove")
    public ResponseEntity<Void> removeItemFromCart(@Valid @RequestBody CartDTO dto) {
        if (dto.quantity() <= 0.0) {
            return ResponseEntity.badRequest().build();
        }

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        this.customerCartService.removeItemFromCardOfUserEmail(userEmail, dto.productVariantId(), dto.quantity());
        return ResponseEntity.ok().build();
    }


    @GetMapping("/number-of-items")
    public ResponseEntity<Map<String, String>> getNumberOfItemsInCart() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer numberOfItemsInCart = this.customerCartService.getNumberOfItemsInCartOfUserId(userEmail);
        return ResponseEntity.ok(Map.of("numberOfItemsInCart", numberOfItemsInCart.toString()));
    }

    @GetMapping("/details")
    public ResponseEntity<Page<CustomerCart>> getNumberOfItemsInCart(Pageable pageable) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<CustomerCart> itemList = this.customerCartService.getItemsInCartByUserEmail(userEmail, pageable);
        return ResponseEntity.ok(itemList);
    }
}
