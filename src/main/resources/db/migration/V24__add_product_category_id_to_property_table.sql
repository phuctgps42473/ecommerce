ALTER TABLE properties
    ADD product_category_id BIGINT;

ALTER TABLE properties
    ADD CONSTRAINT FK_PROPERTIES_ON_PRODUCT_CATEGORY FOREIGN KEY (product_category_id) REFERENCES product_categories (id);