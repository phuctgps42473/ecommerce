package backend.ecommerce.erp;

import backend.ecommerce.core.domain.VendorProduct;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VendorProductService {
    private VendorProductRepository vendorProductRepository;

    public VendorProductService(VendorProductRepository vendorProductRepository) {
        this.vendorProductRepository = vendorProductRepository;
    }

    public Page<VendorProduct> getProductsByVendorId(Long vendorId, Pageable pageable) {
        return this.vendorProductRepository.findAll(pageable);
    }

    public void addNewVendorProduct(VendorProduct vendorProduct) {
        save(vendorProduct);
    }

    public void updateVendorProduct(Long id, VendorProduct vendorProduct) {
        VendorProduct old = this.vendorProductRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No vendor product found with id: " + id));
    }

    private void save(VendorProduct vendorProduct)  {
        this.vendorProductRepository.save(vendorProduct);
    }
}
