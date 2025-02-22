package backend.ecommerce.core.cart;

import backend.ecommerce.core.domain.CustomerCart;
import backend.ecommerce.core.domain.ProductVariant;
import backend.ecommerce.core.domain.User;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductVariantRepository;
import backend.ecommerce.core.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerCartService {
    private final ProductVariantRepository productVariantRepository;
    private final CustomerCartRepository customerCartRepository;
    private final UserRepository userRepository;

    public CustomerCartService(ProductVariantRepository productVariantRepository, CustomerCartRepository customerCartRepository, UserRepository userRepository) {
        this.productVariantRepository = productVariantRepository;
        this.customerCartRepository = customerCartRepository;
        this.userRepository = userRepository;
    }

    public Integer getNumberOfItemsInCartOfUserId(String userEmail) {
        return this.customerCartRepository.countAllByUserEmail(userEmail);
    }

    public Page<CustomerCart> getItemsInCartByUserEmail(String userEmail, Pageable pageable) {
        return this.customerCartRepository.findAllByUserId(userEmail, pageable);
    }

    public void addItemToCardOfUserEmail(String email, Long productVariantId, Double additionalQuantity) {
        ProductVariant productVariant = this.productVariantRepository.findById(productVariantId).orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));
        User customer = this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CustomerCart currentCart = this.customerCartRepository
                .findByUserIdAndProductVariantId(customer.getId(), productVariant.getId())
                .orElse(new CustomerCart(customer, productVariant, 0.0));


        double newQuantity = currentCart.getQuantity() + additionalQuantity;
        if (productVariant.getStock() > newQuantity) {
            currentCart.setQuantity(newQuantity);
        } else {
            currentCart.setQuantity(productVariant.getStock());
        }
        this.customerCartRepository.save(currentCart);
    }

    public void removeItemFromCardOfUserEmail(String email, Long productVariantId, Double subtractedQuantity) {
        User customer = this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Optional<CustomerCart> currentCart = this.customerCartRepository
                .findByUserIdAndProductVariantId(customer.getId(), productVariantId);

        if (currentCart.isEmpty()) {
            return;
        }

        CustomerCart cart = currentCart.get();

        double newQuantity = cart.getQuantity() - subtractedQuantity;
        if (newQuantity <= 0) {
            this.customerCartRepository.delete(cart);
        } else {
            cart.setQuantity(newQuantity);
            this.customerCartRepository.save(cart);
        }
    }
}
