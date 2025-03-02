package backend.ecommerce.core.cart;

import backend.ecommerce.core.domain.CustomerCart;
import backend.ecommerce.core.domain.ProductVariant;
import backend.ecommerce.core.domain.User;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductVariantRepository;
import backend.ecommerce.core.repository.PromotionRepository;
import backend.ecommerce.core.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CustomerCartService {
    private final ProductVariantRepository productVariantRepository;
    private final CustomerCartRepository customerCartRepository;
    private final UserRepository userRepository;
    private final PromotionRepository promotionRepository;

    public CustomerCartService(ProductVariantRepository productVariantRepository, CustomerCartRepository customerCartRepository, UserRepository userRepository, PromotionRepository promotionRepository) {
        this.productVariantRepository = productVariantRepository;
        this.customerCartRepository = customerCartRepository;
        this.userRepository = userRepository;
        this.promotionRepository = promotionRepository;
    }

    public Integer getNumberOfItemsInCartOfUserId(String userEmail) {
        return this.customerCartRepository.countAllByUserEmail(userEmail);
    }

    public Page<CartItemResponse> getItemsInCartByUserEmail(String userEmail, Pageable pageable) {
        return this.customerCartRepository.findAllByUserEmail(userEmail, pageable);
    }

    public void updateVariantQuantityInCartWithEmail(String email, Long productVariantId, Double newQuantity) {
        ProductVariant productVariant = this.productVariantRepository.findById(productVariantId).orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
        User customer = this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CustomerCart currentCart = this.customerCartRepository
                .findByUserIdAndProductVariantId(customer.getId(), productVariant.getId())
                .orElse(new CustomerCart(customer, productVariant, newQuantity));

        if (productVariant.getStock() > newQuantity) {
            currentCart.setQuantity(newQuantity);
        } else {
            currentCart.setQuantity(productVariant.getStock());
        }
        this.customerCartRepository.save(currentCart);
    }

    public void removeItemFromCartOfUserEmail(String email, Long variantId) {
        User customer = this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        try {
            this.customerCartRepository.deleteByUserIdAndProductVariantId(customer.getId(), variantId);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
    }

    public void removeSeveralItemsFromCartOfUserId(Long userId, List<Long> variantIdList) {
        try {
            this.customerCartRepository.deleteAllByUserIdAndProductVariantId(userId, variantIdList);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
        }
    }

    public Set<CheckoutItemResponse> getCartItemsOfUserEmailInList(String email, List<Long> checkoutIdList) {
        Set<CheckoutItemResponse> list = this.customerCartRepository.findAllByUserEmailInIdList(email, checkoutIdList);
        System.out.println(checkoutIdList.size());
        list.forEach(item -> item.setPromotionList(promotionRepository.findAllByProductId(item.getProductId())));
        return list;
    }
}
