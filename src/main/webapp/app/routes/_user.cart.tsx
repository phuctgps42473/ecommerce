import { useLoaderData, Form } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

import type { CartItem } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Cart | eShop" },
    {
      name: "description",
      content: "View and manage the items in your shopping cart.",
    },
  ];
};

type LoaderData = {
  cartItems: CartItem[];
};

// Simulate fetching cart items from a database or API (using a cookie or session)
const getCartItems = async (): Promise<CartItem[]> => {
  // Replace this with your actual cart data fetching logic
  const cartItems: CartItem[] = [
    {
      product: {
        id: "1",
        name: "Keychron K2",
        description: "A 75% layout (84-key) wireless mechanical keyboard.",
        price: 79,
        imageUrl: "/images/keychron-k2.webp",
        category: "Keyboards",
      },
      quantity: 2,
    },
    {
      product: {
        id: "3",
        name: "Gateron Yellow Switches",
        description: "Popular linear switches known for their smoothness.",
        price: 25,
        imageUrl: "/images/gateron-yellow.webp",
        category: "Switches",
      },
      quantity: 1,
    },
  ];

  return cartItems;
};

export const loader: LoaderFunction = async () => {
  const cartItems = await getCartItems();
  const data: LoaderData = { cartItems };
  return Response.json(data);
};

export default function Cart() {
  const { cartItems } = useLoaderData<LoaderData>();

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart Items List */}
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cartItems.map((cartItem) => (
                <li key={cartItem.product.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={cartItem.product.imageUrl}
                      alt={cartItem.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={`/product/${cartItem.product.id}`}>
                            {cartItem.product.name}
                          </a>
                        </h3>
                        <p className="ml-4">
                          ${cartItem.product.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {cartItem.product.category}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      {/* Quantity Update Form */}
                      <Form method="post" className="flex items-center">
                        <input
                          type="hidden"
                          name="productId"
                          value={cartItem.product.id}
                        />
                        <label htmlFor={`quantity-${cartItem.product.id}`} className="sr-only">
                          Quantity
                        </label>
                        <select
                          id={`quantity-${cartItem.product.id}`}
                          name="quantity"
                          className="block w-16 border border-gray-300 rounded-md py-1.5 text-base text-center leading-5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          defaultValue={cartItem.quantity}
                        >
                          {[...Array(10).keys()].map((i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          name="action"
                          value="update"
                          className="ml-3 px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                        >
                          Update
                        </button>
                      </Form>

                      {/* Remove Item Button */}
                      <div className="flex">
                        <Form method="post">
                          <input
                            type="hidden"
                            name="productId"
                            value={cartItem.product.id}
                          />
                          <button
                            type="submit"
                            name="action"
                            value="remove"
                            className="font-medium text-blue-600 hover:text-blue-500"
                          >
                            Remove
                          </button>
                        </Form>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cart Summary */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            {/* Checkout Button */}
            <div className="mt-6">
              <a
                href="/checkout"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Checkout
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
