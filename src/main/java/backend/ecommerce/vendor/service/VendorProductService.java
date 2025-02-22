package backend.ecommerce.vendor.service;

import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.vendor.domain.VendorProduct;
import backend.ecommerce.vendor.domain.VendorProductProperty;
import backend.ecommerce.vendor.repository.VendorProductPropertyRepository;
import backend.ecommerce.vendor.repository.VendorProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VendorProductService {
    private final VendorProductRepository vendorProductRepository;
    private final VendorProductPropertyRepository vendorProductPropertyRepository;

    public VendorProductService(VendorProductRepository vendorProductRepository, VendorProductPropertyRepository vendorProductPropertyRepository) {
        this.vendorProductRepository = vendorProductRepository;
        this.vendorProductPropertyRepository = vendorProductPropertyRepository;
    }

    public Page<VendorProduct> getProductsByVendorId(Long vendorId, Pageable pageable) {
        return this.vendorProductRepository.findByVendorId(vendorId, pageable);
    }

    public VendorProduct getProductByIdAndVendorId(Long productId, Long vendorId) {
        return this.vendorProductRepository.findByIdAndVendorId(productId, vendorId).orElseThrow(() -> new ResourceNotFoundException("No product with ID: " + productId + " found for vendor with ID: " + vendorId));
    }

    public void addNewVendorProduct(VendorProduct vendorProduct) {
        vendorProduct.getVendorProductPropertyList().forEach(vpp -> vpp.setVendorProduct(vendorProduct));
        save(vendorProduct);
    }

    public void updateVendorProduct(Long id, VendorProduct vendorProduct) {
        VendorProduct product = this.vendorProductRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No vendor product found with id: " + id));
//        product.setName(vendorProduct.getName());
//        product.setBrand(vendorProduct.getBrand());
//        // TODO: FETCH PRODUCT BEFORE GET MAYBE USE A DTO
//        old.setProduct(vendorProduct.getProduct());
        save(product);
    }

    private void save(VendorProduct vendorProduct) {
        this.vendorProductRepository.save(vendorProduct);
    }
}
