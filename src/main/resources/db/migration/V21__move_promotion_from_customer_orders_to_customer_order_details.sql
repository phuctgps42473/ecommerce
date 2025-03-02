ALTER TABLE customer_orders
DROP
CONSTRAINT fk_customer_orders_on_promotion;

ALTER TABLE customer_order_details
    ADD promotion_id BIGINT;

ALTER TABLE customer_order_details
    ADD CONSTRAINT FK_CUSTOMER_ORDER_DETAILS_ON_PROMOTION FOREIGN KEY (promotion_id) REFERENCES promotions (id);

ALTER TABLE customer_orders
DROP
COLUMN promotion_id;