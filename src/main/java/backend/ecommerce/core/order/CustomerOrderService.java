package backend.ecommerce.core.order;

import backend.ecommerce.core.cart.CustomerCartService;
import backend.ecommerce.core.domain.*;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.PromotionRepository;
import backend.ecommerce.core.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomerOrderService {
    private final CustomerCartService customerCartService;
    private final InventoryTransactionService inventoryTransactionService;
    private final PaymentTransactionService paymentTransactionService;
    private final ProductVariantService productVariantService;
    private final CustomerOrderRepository customerOrderRepository;
    private final CustomerOrderDetailRepository customerOrderDetailRepository;
    private final UserService userService;
    private final AddressService addressService;
    private final PromotionRepository promotionRepository;


    public CustomerOrderService(CustomerCartService customerCartService, InventoryTransactionService inventoryTransactionService, PaymentTransactionService paymentTransactionService, CustomerOrderRepository customerOrderRepository, CustomerOrderDetailRepository customerOrderDetailRepository, UserService userService, ProductVariantService productVariantService, AddressService addressService, PromotionRepository promotionRepository) {
        this.customerCartService = customerCartService;
        this.inventoryTransactionService = inventoryTransactionService;
        this.paymentTransactionService = paymentTransactionService;
        this.customerOrderRepository = customerOrderRepository;
        this.customerOrderDetailRepository = customerOrderDetailRepository;
        this.userService = userService;
        this.productVariantService = productVariantService;
        this.addressService = addressService;
        this.promotionRepository = promotionRepository;
    }

    public Page<CustomerOrder> getOrderListByEmail(String email, Pageable pageable) {
        return this.customerOrderRepository.findAllByCustomerEmail(email, pageable);
    }

    public Long handleNewOrder(String email, CustomerOrderRequest dto) {
        User customer = userService.getUserByEmail(email);
        Address address = this.addressService.getAddressByIdAndUserId(dto.addressId(), customer.getId());

        CustomerOrder co = new CustomerOrder(customer, address, dto.shipmentFee(), dto.totalPrice(), Set.of());

        Set<CustomerOrderDetail> customerOrderDetailList = dto.products().stream().flatMap(p -> p.variants().stream().map(v -> {
            ProductVariant pv = productVariantService.getProductVariantById(v.variantId());
            Promotion promotion = null;
            if (p.promotionId() != null) {
                promotion = promotionRepository.findById(p.promotionId()).orElseThrow(() -> new ResourceNotFoundException("No promotion found with id: " + p.promotionId()));
            }
            return new CustomerOrderDetail(co, pv, v.quantity(), promotion);
        })).collect(Collectors.toSet());
        co.setCustomerOrderDetailList(customerOrderDetailList);

        // Create order

       CustomerOrder order =  this.customerOrderRepository.save(co);

        // TODO: Delete ordered items from cart
        this.customerCartService.removeSeveralItemsFromCartOfUserId(
                customer.getId(),
                dto.products().stream().flatMap(p -> p.variants().stream().map(CustomerOrderRequest.OrderProduct.OrderVariant::variantId)).toList()
        );

        return order.getId();

        // TODO: Create inventory transaction
        // TODO: Update product variant quantity
    }
}
