ALTER TABLE customer_order_details
DROP
COLUMN product_id;

ALTER TABLE customer_order_details
    ALTER COLUMN product_variant_id SET NOT NULL;

ALTER TABLE customer_order_details
    ADD CONSTRAINT pk_customer_order_details PRIMARY KEY (order_id, product_variant_id);