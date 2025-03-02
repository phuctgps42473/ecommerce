package backend.ecommerce.core.service;

import backend.ecommerce.core.repository.InventoryTransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class InventoryTransactionService {
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public InventoryTransactionService(InventoryTransactionRepository inventoryTransactionRepository) {
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }
}
