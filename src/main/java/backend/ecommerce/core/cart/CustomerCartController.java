package backend.ecommerce.core.cart;

import backend.ecommerce.core.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/cart")
public class CustomerCartController {
    private final CustomerCartService customerCartService;

    public CustomerCartController(CustomerCartService customerCartService) {
        this.customerCartService = customerCartService;
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Page<CartItemResponse>>> getNumberOfItemsInCart(Pageable pageable) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<CartItemResponse> itemList = this.customerCartService.getItemsInCartByUserEmail(userEmail, pageable);
        return ResponseEntity.ok(ApiResponse.success(200, itemList));
    }

    @PutMapping("")
    public ResponseEntity<ApiResponse<Void>> addItemToCart(@Valid @RequestBody CartDTO cartDTO) {
        if (cartDTO.quantity() <= 0.0) {
            return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST));
        }
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        this.customerCartService.updateVariantQuantityInCartWithEmail(userEmail, cartDTO.productVariantId(), cartDTO.quantity());
        return ResponseEntity.ok(ApiResponse.success(200));
    }

    @DeleteMapping("")
    public ResponseEntity<ApiResponse<Void>> removeItemFromCart(@RequestParam(name = "productVariantId") Long variantId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        this.customerCartService.removeItemFromCartOfUserEmail(userEmail, variantId);
        return ResponseEntity.ok(ApiResponse.success(200));
    }

    @GetMapping("/number-of-items")
    public ResponseEntity<ApiResponse<Map<String, String>>> getNumberOfItemsInCart() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer numberOfItemsInCart = this.customerCartService.getNumberOfItemsInCartOfUserId(userEmail);
        return ResponseEntity.ok(new ApiResponse<>("success", 200, Map.of("numberOfItemsInCart", numberOfItemsInCart.toString())));
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Set<CheckoutItemResponse>>> checkout(@Valid @RequestBody CheckoutRequest dto) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ApiResponse.success(200, this.customerCartService.getCartItemsOfUserEmailInList(userEmail, dto.checkoutItemIdList())));
    }

}
