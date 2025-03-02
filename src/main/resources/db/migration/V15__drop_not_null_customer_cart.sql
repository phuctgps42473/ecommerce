ALTER TABLE customer_carts
    ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE customer_carts
    ALTER COLUMN product_variant_id DROP NOT NULL;