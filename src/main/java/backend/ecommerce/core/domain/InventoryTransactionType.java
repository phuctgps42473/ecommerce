package backend.ecommerce.core.domain;

public enum InventoryTransactionType {
    /**
     * Receiving goods from a supplier (increase inventory).
     */
    STOCK_RECEIPT,  // or PURCHASE

    /**
     * Sale of goods to a customer (decrease inventory).
     */
    SALE, // or CUSTOMER_ORDER

    /**
     * Return of goods from a customer (increase inventory).
     */
    SALES_RETURN,

    /**
     * General adjustment to inventory levels (use notes to explain).
     */
    ADJUSTMENT,

    /**
     * Manual increase to inventory levels (e.g., after stocktaking).
     */
    ADJUSTMENT_INCREASE,

    /**
     * Manual decrease to inventory levels (e.g., due to damage).
     */
    ADJUSTMENT_DECREASE,

    /**
     * Transfer of inventory *into* a location.
     */
    TRANSFER_IN,

    /**
     * Transfer of inventory *out of* a location.
     */
    TRANSFER_OUT,

    /**
     * Removal of damaged or obsolete inventory.
     */
    WRITE_OFF,

    /**
     * The opening inventory balance for a new business/product.
     */
    INITIAL_STOCK,

    /**
     *  Loss / shrinkage (decrease inventory).
     */
    LOSS, // or SHRINKAGE
    /**
     *  Damage (decrease inventory).
     */
    DAMAGE
}
