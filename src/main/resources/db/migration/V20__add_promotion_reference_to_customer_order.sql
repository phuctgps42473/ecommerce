ALTER TABLE customer_orders
    ADD promotion_id BIGINT;

ALTER TABLE customer_orders
    ADD CONSTRAINT FK_CUSTOMER_ORDERS_ON_PROMOTION FOREIGN KEY (promotion_id) REFERENCES promotions (id);