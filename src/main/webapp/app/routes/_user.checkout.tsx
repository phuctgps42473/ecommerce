import { ActionFunctionArgs, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import apiFetcher from "~/utils/fetcher.server";
import { formatPrice } from "~/utils/format_price";
import { getAccessToken } from "~/utils/token.server";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Checkout | eShop" },
    {
      name: "description",
      content: "Complete your purchase at eShop.",
    },
  ];
};

type CheckoutItem = {
  cartItemId: number;
  image: string;
  price: number;
  productId: number; // Keep productId
  productName: string;
  productVariantId: number
  productVariantName: string,
  quantity: number
  promotionList: Promotion[]
}

type Promotion = {
  id: number
  name: string
  promotionType: "PERCENTAGE" | "FIXED_AMOUNT";
  promotionValue: number
  startDate: string
  endDate: string
}

type Address = {
  id: number;
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
};

type LoaderData = {
  checkoutList: CheckoutItem[];
  addresses: Address[];
};

type Order = {
  addressId: number,
  shipmentFee: number
  totalPrice: number
  products: Array<{
    productId: number,
    promotionId: number | undefined,
    variants: Array<{
      variantId: number,
      quantity: number
      subTotal: number
    }>
  }>
}

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const state = searchParams.get("state");

  invariant(state !== null, "State must be defined");
  if (state === null) {
    return redirect("/");
  }

  const accessToken = await getAccessToken(request);
  if (accessToken === null) {
    return redirect("/");
  }

  const decodedBuf = Buffer.from(state, "base64");
  const checkoutItemList = decodedBuf.toString();

  try {
    // Fetch checkout items
    const checkoutRes = await apiFetcher("/cart/checkout", {
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + accessToken
      },
      method: "POST",
      data: JSON.stringify({ checkoutItemList: JSON.parse(checkoutItemList).map(Number) })
    });
    const checkoutList = checkoutRes.data.data;

    // Fetch user addresses
    const addressRes = await apiFetcher("/addresses", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const addresses: Address[] = addressRes.data.data;

    return Response.json({ checkoutList, addresses });

  } catch (error: any) {
    // Check if the error is due to too many addresses
    if (error.response && error.response.status === 400 && error.response.data.message === "User has reached the maximum number of addresses") {
      // Handle the specific error (e.g., display a message to the user)
      return Response.json({ checkoutList: [], addresses: [] }, {
        status: 400, // Or a custom status code if you prefer
        statusText: "Too Many Addresses", // Add a custom status text
        headers: {
          "X-Remix-Error": "Too Many Addresses",  // Add a custom header
        }
      });
    }
    // TODO: HANDLE other error
    console.log(error);
    return { checkoutList: [], addresses: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const accessToken = await getAccessToken(request);

  if (accessToken === null) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const jsonOrder = formData.get("order");
  invariant(typeof jsonOrder === "string", "Error getting order");

  try {
    const res = await apiFetcher("/orders", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken
      },
      data: jsonOrder
    });

    const orderId = res.data.data.orderId;

    return redirect("/checkout/success/"+orderId);
  } catch (error) {
    console.log("ERROR");
  }


  return {};

}

export default function Checkout() {
  const { checkoutList, addresses } = useLoaderData<LoaderData>();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "paypal" | "etransfer" | "cod">("credit-card");
  const [selectedPromotions, setSelectedPromotions] = useState<{ [key: number]: number }>({}); // productId: promotionId
  const submit = useSubmit();

  // --- Group Items by Product ID ---
  const groupedItems: { [productId: number]: CheckoutItem[] } = {};
  checkoutList.forEach(item => {
    if (!groupedItems[item.productId]) {
      groupedItems[item.productId] = [];
    }
    groupedItems[item.productId].push(item);
  });

  // Set default address on initial load
  // useEffect(() => {
  //     const defaultAddress = addresses.find(a => a.isDefault);
  //     if (defaultAddress) {
  //         setSelectedAddressId(defaultAddress.id);
  //     }
  // }, [addresses]);


  // --- Calculate Totals (with Promotions) ---
  const calculateDiscount = (productId: number, items: CheckoutItem[]) => {
    const selectedPromotionId = selectedPromotions[productId];
    if (!selectedPromotionId) {
      return 0;
    }
    //We use the first variant for get promotion since all variant has the same list of promotion.
    const firstItem = items[0];
    const promotion = firstItem.promotionList.find((p) => p.id === selectedPromotionId);

    if (!promotion) {
      return 0;
    }

    const totalProductPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (promotion.promotionType === "PERCENTAGE") {
      return totalProductPrice * (promotion.promotionValue / 100);
    } else if (promotion.promotionType === "FIXED_AMOUNT") {
      return Math.min(promotion.promotionValue, totalProductPrice);
    }
    return 0;
  };


  const cartTotal = Object.entries(groupedItems).reduce(
    (total, [productId, items]) => {
      const productTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const discount = calculateDiscount(parseInt(productId, 10), items);
      return total + productTotal - discount;
    }, 0
  );

  const shipping = 32000;
  const orderTotal = cartTotal + shipping;

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddressId(parseInt(event.target.value, 10));
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as "credit-card" | "paypal" | "etransfer" | "cod");
  };

  const handlePromotionChange = (productId: number, promotionId: string) => {
    setSelectedPromotions(prevPromotions => ({
      ...prevPromotions,
      [productId]: promotionId ? parseInt(promotionId, 10) : 0,
    }));
  };

  function handlePlacingOrder(e: React.FormEvent) {
    e.preventDefault();

    if (selectedAddressId === null) {
      //TODO: HANDLE
      return;
    }

    const formData = new FormData();


    const order: Order = {
      addressId: selectedAddressId,
      shipmentFee: shipping,
      totalPrice: orderTotal,
      products: Object.keys(groupedItems).map((k) => {
        const key = Number(k);
        return {
          productId: key,
          promotionId: selectedPromotions[key],
          variants: groupedItems[key].map(item => ({
            variantId: item.productVariantId,
            quantity: item.quantity,
            subTotal: item.quantity * item.price
          }))
        };
      })
    };

    formData.append("order", JSON.stringify(order));

    submit(formData, { method: "POST" })
  }

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
              {Object.entries(groupedItems).map(([productId, items]) => (
                <li key={productId} className="py-6">
                  {/* Display only one product name and promotion selector per group */}
                  <div className="flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={items[0].image}
                        alt={items[0].productName}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{items[0].productName}</h3> {/* Use the product name */}
                          {/* Promotion Selection (per product group) */}
                          <div>
                            <label htmlFor={`promotion-${productId}`} className="block text-sm font-medium text-gray-700">
                              Promotion:
                            </label>
                            <select
                              id={`promotion-${productId}`}
                              name={`promotion-${productId}`}
                              value={selectedPromotions[parseInt(productId, 10)] || ""}
                              onChange={(e) => handlePromotionChange(parseInt(productId, 10), e.target.value)}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">No Promotion</option>
                              {items[0].promotionList.map((promotion) => (  // Use the first item's promotionList
                                <option key={promotion.id} value={promotion.id}>
                                  {promotion.name} ({promotion.promotionType === 'PERCENTAGE' ? `${promotion.promotionValue}% off` : `${formatPrice(promotion.promotionValue)} off`})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* List variants (now displayed correctly) */}
                  <div className="mt-4 divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.productVariantId} className="py-2 flex justify-between text-sm">
                        <p className="text-gray-500">{item.productVariantName}</p>
                        <p className="text-gray-900">
                          Qty: {item.quantity} x {formatPrice(item.price)} = {formatPrice(item.quantity * item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary Totals */}
          <div className="border-t border-gray-200 mt-6 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
              <p>Shipping</p>
              <p>{formatPrice(shipping)}</p>
            </div>
            {/* <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
              <p>Taxes</p>
              <p>${tax.toFixed(2)}</p>
            </div> */}
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-6">
              <p>Order Total</p>
              <p>{formatPrice(orderTotal)}</p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Shipping Information
          </h2>

          {/* Address Selection */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Select Address:
            </label>
            <select
              id="address"
              name="address"
              value={selectedAddressId || ""}
              onChange={handleAddressChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>Select an address</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {`${address.specificAddress}, ${address.province}, ${address.district} ${address.ward}`}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Address Button */}
          <div className="mb-6">
            <Link
              to="/user/address/new"  // Link to your "Add New Address" route
              className="text-blue-600 hover:text-blue-800"
            >
              Add New Address
            </Link>
          </div>

          {/* Display Selected Address (Read-only) */}
          {selectedAddressId && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-base font-medium text-gray-900">Selected Address:</h3>
              {addresses.map((address) => {
                return address.id === selectedAddressId ?
                  (
                    <p key={address.id} className="text-sm text-gray-700">
                      {address.specificAddress}<br />
                      {address.ward}, {address.district} {address.province}<br />
                    </p>
                  )
                  : null
              })}
            </div>
          )}

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
                    value="credit-card"
                    checked={paymentMethod === "credit-card"}
                    onChange={handlePaymentMethodChange}
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
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={handlePaymentMethodChange}
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
                    value="etransfer"
                    checked={paymentMethod === "etransfer"}
                    onChange={handlePaymentMethodChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="etransfer" className="ml-3 block text-sm font-medium text-gray-700">
                    eTransfer
                  </label>
                </div>
                {/* COD Option */}
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="payment-method"
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={handlePaymentMethodChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Credit Card Form (Conditional) */}
            {paymentMethod === "credit-card" && (
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
                      autoComplete="cc-csc"
                      required
                      placeholder="123"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <div className="mt-6">
            <Form onSubmit={handlePlacingOrder} method="post" action="/checkout">
              <input type="hidden" name="selectedAddressId" value={selectedAddressId || ""} />
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <input type="hidden" name="selectedPromotions" value={JSON.stringify(selectedPromotions)} />
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Place Order
              </button>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
