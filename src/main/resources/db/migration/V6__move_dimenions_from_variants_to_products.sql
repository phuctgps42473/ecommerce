ALTER TABLE products
    ADD dimensions_mm VARCHAR(255);

ALTER TABLE product_categories
    ADD CONSTRAINT uc_product_categories_slug UNIQUE (slug);

ALTER TABLE vendor_products
DROP
COLUMN brand;

ALTER TABLE vendor_products
DROP
COLUMN name;

ALTER TABLE product_variants
DROP
COLUMN dimensions_mm;