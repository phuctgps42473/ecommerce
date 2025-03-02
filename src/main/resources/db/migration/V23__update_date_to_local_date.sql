ALTER TABLE users
    DROP COLUMN activation_token_expiration_date;

ALTER TABLE users
    DROP COLUMN created_at;

ALTER TABLE users
    DROP COLUMN last_update;

ALTER TABLE users
    DROP COLUMN reset_token_expiration_date;

ALTER TABLE users
    ADD activation_token_expiration_date date;

ALTER TABLE customer_orders
    DROP COLUMN created_at;

ALTER TABLE customer_orders
    DROP COLUMN updated_at;

ALTER TABLE customer_orders
    ADD created_at date;

ALTER TABLE users
    ADD created_at date;

ALTER TABLE users
    ALTER COLUMN created_at DROP NOT NULL;

ALTER TABLE users
    ADD last_update date;

ALTER TABLE users
    ALTER COLUMN last_update DROP NOT NULL;

ALTER TABLE users
    ADD reset_token_expiration_date date;

ALTER TABLE customer_orders
    ADD updated_at date;