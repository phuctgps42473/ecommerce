package backend.ecommerce.core.service;

import backend.ecommerce.core.domain.Address;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.AddressRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class AddressService {
    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public Address getAddressByIdAndUserId(long addressId, long userId) {
        return this.addressRepository.findByAddressIdAndUserId(addressId, userId).orElseThrow(() -> new ResourceNotFoundException("Cannot found address"));
    }

    public Set<Address> getAddressListByCustomerEmail(String email) {
        return this.addressRepository.findAllByUserEmail(email);
    }
}
