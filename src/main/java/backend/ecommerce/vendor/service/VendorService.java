package backend.ecommerce.vendor.service;

import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.vendor.domain.Vendor;
import backend.ecommerce.vendor.repository.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VendorService {
    private VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public Page<Vendor> getAllVendors(Pageable pageable) {
        return vendorRepository.findAll(pageable);
    }

    public void createNewVendor(Vendor vendor) {
        save(vendor);
    }

    public Vendor getVendorDetail(Long id) {
        return this.vendorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No vendor found for id" + id));
    }

    public void updateVendor(Long id, Vendor vendor) {
        Vendor old = this.vendorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No vendor found for id" + id));
        vendor.setId(old.getId());
        save(vendor);
    }

    private void save(Vendor vendor) {
        this.vendorRepository.save(vendor);
    }
}
