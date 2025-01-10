CREATE TABLE users
(
    id              SERIAL primary key,
    first_name      text not null,
    last_name       text not null,
    age             int  not null,
    address         char(100),
    email           text not null,
    hashed_password text not null,
    created_at      timestamptz
);

CREATE TABLE product_categories
(
    id   SERIAL primary key,
    name text not null
);

create table carts
(
    id      serial primary key,
    user_id serial not null
);


create table products
(
    id           serial primary key,
    name         text           not null,
    product_type serial,
    foreign key (product_type) REFERENCES product_categories (id),
    price        numeric(15, 3) not null
);

create table product_carts
(
    id         serial primary key,
    product_id serial not null,
    cart_id    serial not null,
    quantity   int    not null,
    foreign key (product_id) references products (id),
    foreign key (cart_id) references carts (id)
);

