ALTER TABLE products
    ADD weight DOUBLE PRECISION;

ALTER TABLE product_variants
DROP
COLUMN weight;