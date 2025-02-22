package backend.ecommerce.vendor.controller;

import backend.ecommerce.vendor.domain.Vendor;
import backend.ecommerce.vendor.domain.VendorProduct;
import backend.ecommerce.vendor.service.VendorProductService;
import backend.ecommerce.vendor.service.VendorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/vendors")
public class VendorProductController {
    private static final Logger log = LoggerFactory.getLogger(VendorProductController.class);
    private final VendorService vendorService;
    private final VendorProductService vendorProductService;

    public VendorProductController(VendorService vendorService, VendorProductService vendorProductService) {
        this.vendorService = vendorService;
        this.vendorProductService = vendorProductService;
    }

    @GetMapping("/{vendorId}/products")
    public ResponseEntity<Page<VendorProduct>> getProducts(
            @PathVariable("vendorId") Long vendorId,
            Pageable pageable) {
        return ResponseEntity.ok(vendorProductService.getProductsByVendorId(vendorId, pageable));
    }

    @PostMapping("/{vendorId}/products")
    public ResponseEntity<Void> addNewProduct(@RequestBody VendorProduct newVendorProduct, @PathVariable Long vendorId) {
        log.info("Received a request for adding new vendor product: {}", newVendorProduct.getVendorProductPropertyList().size());

        Vendor vendor = vendorService.getVendorDetail(vendorId);
        newVendorProduct.setVendor(vendor);

        this.vendorProductService.addNewVendorProduct(newVendorProduct);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{vendorId}/products/{productId}")
    public ResponseEntity<VendorProduct> getProducts(@PathVariable("vendorId") Long vendorId, @PathVariable("productId") Long productId) {
        return ResponseEntity.ok(vendorProductService.getProductByIdAndVendorId(productId, vendorId));
    }

    @PutMapping("/{vendorId}/products/{productId}")
    public ResponseEntity<Void> updateVendorProduct(
            @PathVariable("vendorId") Long vendorId,
            @PathVariable("productId") Long productId,
            @RequestBody VendorProduct updateVendorProduct
    ) {
        this.vendorProductService.updateVendorProduct(productId, updateVendorProduct);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
