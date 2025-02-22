package backend.ecommerce.vendor.controller;

import backend.ecommerce.vendor.domain.Vendor;
import backend.ecommerce.vendor.domain.VendorProduct;
import backend.ecommerce.vendor.service.VendorProductService;
import backend.ecommerce.vendor.service.VendorService;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class VendorController {
    private final VendorService vendorService;
    private final VendorProductService vendorProductService;

    public VendorController(VendorService vendorService, VendorProductService vendorProductService) {
        this.vendorProductService = vendorProductService;
        this.vendorService = vendorService;
    }

    @GetMapping("/vendors")
    public ResponseEntity<Page<Vendor>> getAllVendors(@Nullable Pageable pageable) {
        Page<Vendor> vendorPage = this.vendorService.getAllVendors(pageable);
        return ResponseEntity.ok(vendorPage);
    }

    @PostMapping("/vendors")
    public ResponseEntity<Void> createNewVendor(@RequestBody Vendor vendor) {
        this.vendorService.createNewVendor(vendor);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/vendors/{vendorId}")
    public ResponseEntity<Vendor> getVendorDetail(@PathVariable Long vendorId) {
        return ResponseEntity.ok(this.vendorService.getVendorDetail(vendorId));
    }

    @PutMapping("/vendors/{vendorId}")
    public ResponseEntity<Void> updateVendorDetail(@NonNull @PathVariable Long vendorId, @RequestBody Vendor vendor) {
        this.vendorService.updateVendor(vendorId, vendor);
        return ResponseEntity.ok().build();
    }
}
