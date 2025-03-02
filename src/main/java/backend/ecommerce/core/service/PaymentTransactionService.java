package backend.ecommerce.core.service;

import backend.ecommerce.core.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentTransactionService {
    private final PaymentTransactionRepository paymentTransactionRepository;

    public PaymentTransactionService(PaymentTransactionRepository paymentTransactionRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
    }
}
