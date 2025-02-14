import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Checkout | eShop" },
    {
      name: "description",
      content: "Complete your purchase at eShop.",
    },
  ];
};

export default function Checkout() {
  // Replace with data from your cart (e.g., using a loader)
  const cartItems = [
    {
      product: {
        id: "1",
        name: "Keychron K2",
        price: 79,
        imageUrl: "/images/keychron-k2.webp",
      },
      quantity: 2,
    },
    {
      product: {
        id: "3",
        name: "Gateron Yellow Switches",
        price: 25,
        imageUrl: "/images/gateron-yellow.webp",
      },
      quantity: 1,
    },
  ];

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = 10; // Replace with your shipping calculation
  const tax = (cartTotal + shipping) * 0.1; // Replace with your tax calculation
  const orderTotal = cartTotal + shipping + tax;

  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
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
                          <h3>{cartItem.product.name}</h3>
                          <p className="ml-4">
                            ${cartItem.product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">
                          Qty {cartItem.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary Totals */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                <p>Taxes</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-6">
                <p>Order Total</p>
                <p>${orderTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Shipping Information
            </h2>
            {/* Shipping Information Form */}
            <form className="mt-4 grid grid-cols-1 gap-y-6">
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="firstName"
                      autoComplete="given-name"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      name="lastName"
                      autoComplete="family-name"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      autoComplete="address-level1"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      autoComplete="postal-code"
                      required
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Payment Information */}
            <div className="mt-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Payment Information
              </h2>
                <fieldset>
                    <legend className="sr-only">Payment method</legend>
                    <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <input
                        id="credit-card"
                        name="payment-method"
                        type="radio"
                        defaultChecked
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit card
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                        id="paypal"
                        name="payment-method"
                        type="radio"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                        PayPal
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                        id="etransfer"
                        name="payment-method"
                        type="radio"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor="etransfer" className="ml-3 block text-sm font-medium text-gray-700">
                        eTransfer
                        </label>
                    </div>
                    </div>
                </fieldset>

                {/* Credit Card Form */}
                <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
                    <div className="col-span-4">
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                        Card number
                    </label>
                    <div className="mt-1">
                        <input
                        type="text"
                        id="card-number"
                        name="card-number"
                        autoComplete="cc-number"
                        required
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    </div>

                    <div className="col-span-3">
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                        Expiration date
                    </label>
                    <div className="mt-1">
                        <input
                        type="text"
                        name="expiration-date"
                        id="expiration-date"
                        autoComplete="cc-exp"
                        required
                        placeholder="MM / YY"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                        CVC
                    </label>
                    <div className="mt-1">
                        <input
                        type="text"
                        name="cvc"
                        id="cvc"
                        // autoComplete="csc"
                        autoComplete="cc-csc"
                        required
                        placeholder="123"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    </div>
                </div>
            </div>

            {/* Place Order Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </main>
  );
}
