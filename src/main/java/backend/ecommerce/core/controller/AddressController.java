package backend.ecommerce.core.controller;

import backend.ecommerce.core.domain.Address;
import backend.ecommerce.core.dto.ApiResponse;
import backend.ecommerce.core.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<Set<Address>>> getAddressList() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(new ApiResponse<>("success", 200, this.addressService.getAddressListByCustomerEmail(email)));
    }

//    @PostMapping("/addresses")
//    public ResponseEntity<List<Address>> addNewAddress(
//            @Valid @RequestBody
//            ) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = authentication.getName();
//        return ResponseEntity.ok(this.addressService.getAddressListByCustomerEmail(email));
//    }
}
