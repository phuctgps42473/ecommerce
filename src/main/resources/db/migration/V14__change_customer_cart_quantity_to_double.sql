ALTER TABLE customer_carts
DROP
COLUMN quantity;

ALTER TABLE customer_carts
    ADD quantity DOUBLE PRECISION;