ALTER TABLE customer_order_details
DROP
COLUMN quantity;

ALTER TABLE customer_order_details
    ADD quantity DOUBLE PRECISION;