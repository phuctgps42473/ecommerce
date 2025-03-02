ALTER TABLE vendor_product_properties
DROP
CONSTRAINT fk_vendor_product_properties_on_product_property;

ALTER TABLE vendor_product_properties
DROP
CONSTRAINT fk_vendor_product_properties_on_vendor_product;

ALTER TABLE product_properties
    ADD product_id BIGINT;

ALTER TABLE product_properties
    ADD CONSTRAINT FK_PRODUCT_PROPERTIES_ON_PRODUCT FOREIGN KEY (product_id) REFERENCES products (id);

DROP TABLE vendor_product_properties CASCADE;