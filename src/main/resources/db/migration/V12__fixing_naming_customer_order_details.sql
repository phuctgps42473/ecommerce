ALTER TABLE customer_order_details
DROP
COLUMN order_id;

ALTER TABLE customer_order_details
    ALTER COLUMN customer_order_id SET NOT NULL;

ALTER TABLE customer_order_details
    ADD CONSTRAINT pk_customer_order_details PRIMARY KEY (customer_order_id, product_variant_id);