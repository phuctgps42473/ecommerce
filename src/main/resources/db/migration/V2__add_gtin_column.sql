ALTER TABLE product_variants
    ADD gtin VARCHAR(255);

ALTER TABLE vendors
    ADD CONSTRAINT uc_vendors_name UNIQUE (name);