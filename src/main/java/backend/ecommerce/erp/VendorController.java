package backend.ecommerce.erp;

import backend.ecommerce.core.domain.Vendor;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/erp")
public class VendorController {
    VendorService vendorService;

    public VendorController(VendorService vendorService) {
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
