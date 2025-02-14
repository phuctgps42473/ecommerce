package backend.ecommerce.core.domain;

public enum PaymentTransactionType {
    /**
     * Customer payment for an order.
     */
    PAYMENT,

    /**
     * Refund issued to a customer.
     */
    REFUND,
    /**
     * Purchase of non-inventory expenses (e.g., office supplies, rent).
     */
    EXPENSE
}
