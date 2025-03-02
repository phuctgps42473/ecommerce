import { useLoaderData, Form, redirect, useNavigation, useSubmit } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import apiFetcher from "~/utils/fetcher.server";
import { getAccessToken } from "~/utils/token.server";
import { formatPrice } from "~/utils/format_price";
import { useEffect, useState } from "react";
import { SELECTED_ITEMS } from "~/constants";


type CartItem = {
  cartItemId: number,
  productVariantId: number,
  productName: string,
  productSlug: string,
  variantName: string,
  image: string,
  price: number,
  quantity: number
}

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
  cartItemList: CartItem[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const accessToken = await getAccessToken(request);
  if (typeof accessToken !== "string") {
    return redirect("/login");
  }
  try {
    const res = await apiFetcher("/cart", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });

    const cartItemList = res.data.data.content;

    const data: LoaderData = { cartItemList };
    return Response.json(data);
  } catch (error) {
    console.log(error);
    // TODO: HANDLE ERROR
    return {};
  }
}

// Action function to handle quantity updates and checkout
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const productVariantId = formData.get("productVariantId");
  const quantity = formData.get("quantity");
  const actionType = formData.get("action");
  const selectedItems = formData.getAll("selectedItems"); // Get all selected items

  const accessToken = await getAccessToken(request);
  if (typeof accessToken !== "string") {
    return redirect("/login");
  }

  if (actionType === "remove") {
    // Logic to remove the item (same as before)
    try {
      await apiFetcher(`/cart?productVariantId=${productVariantId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      return redirect("/cart"); // Redirect to the cart to refresh
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      // TODO: Handle error appropriately (e.g., show error message)
      return { error: "Failed to remove item from cart." };
    }
  } else if (actionType === "checkout") {
    // Handle checkout of selected items
    if (selectedItems.length === 0) {
      return { error: "No items selected for checkout." };
    }

    // Let's assume this is the state
    const buf = Buffer.from(JSON.stringify(selectedItems));
    const state = buf.toString("base64");

    // Redirect to checkout with selected item IDs
    const searchParams = new URLSearchParams();
    searchParams.append("state", state);
    return redirect(`/checkout?${searchParams.toString()}`);

  } else if (actionType === "updateQuantity") {
    // Handle quantity update (put it to else will work too.)
    if (!productVariantId || typeof productVariantId !== 'string' || !quantity || typeof quantity !== 'string') {
      return { error: "Invalid request" };
    }
    try {
      // Make API call to update quantity
      await apiFetcher(`/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken, // Include the access token
        },
        data: JSON.stringify({ productVariantId, quantity: parseInt(quantity, 10) }),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating quantity:", error);
      return { error: "Failed to update quantity" }; // Return an error object
    }
  }
  return null; // Or some default return
};



export default function Cart() {
  const { cartItemList } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [localCart, setLocalCart] = useState(cartItemList || []);
  const [selectedItems, setSelectedItems] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(SELECTED_ITEMS) || "[]")
    } else {
      return [];
    }
  }); // Array of selected item IDs


  // Update local cart when the loader data changes
  useEffect(() => {
    if (cartItemList) {
      setLocalCart(cartItemList);
    }


  }, [cartItemList]);

  // Function to update quantity locally
  const handleQuantityChange = (productVariantId: number, newQuantity: number) => {
    const updatedCart = localCart.map(item => {
      if (item.productVariantId === productVariantId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setLocalCart(updatedCart);

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('productVariantId', productVariantId.toString());
    formData.append('quantity', newQuantity.toString());
    formData.append('action', "updateQuantity")

    // Debounce the form submission
    debouncedSubmit(formData);
  };

  // Debounce function to prevent rapid API calls
  const debounce = (func: any, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSubmit = debounce((formData: FormData) => {
    submit(formData, { method: 'POST', action: '/cart' });
  }, 500);

  const handleSelectItem = (productVariantId: number) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(productVariantId)) {
        // If already selected, remove it
        const updated = prevSelectedItems.filter((id) => id !== productVariantId);
        localStorage.setItem(SELECTED_ITEMS, JSON.stringify(updated));
        return updated;
      } else {
        // If not selected, add it
        const updated = [...prevSelectedItems, productVariantId];
        localStorage.setItem(SELECTED_ITEMS, JSON.stringify(updated));
        return updated;
      }
    });
  };

  const handleCheckoutSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to checkout."); // Or a more user-friendly message
      return;
    }
    const formData = new FormData();
    selectedItems.forEach(id => formData.append("selectedItems", id.toString()));
    formData.append("action", "checkout"); // Important: Indicate checkout action
    submit(formData, { method: "POST", action: "/cart" });
  };

  // Calculate subtotal based on *local* cart state
  const cartTotal = localCart.reduce((total, item) => selectedItems.includes(item.productVariantId) ? total + item.price * item.quantity : total, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {localCart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart Items List */}
          <div className="flow-root">
            <Form method="post" id="checkout-form">
              <ul className="-my-6 divide-y divide-gray-200">
                {localCart.map((cartItem) => (
                  <li key={cartItem.productVariantId} className="flex py-6">
                    {/* Checkbox for selecting item */}
                    <input
                      type="checkbox"
                      name="selectedItems"
                      value={cartItem.productVariantId}
                      checked={selectedItems.includes(cartItem.productVariantId)}
                      onChange={() => handleSelectItem(cartItem.productVariantId)}
                      className="mr-4"
                    />
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={cartItem.image}
                        alt={cartItem.variantName}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={`/products/${cartItem.productSlug}`}>
                              {cartItem.productName}
                            </a>
                          </h3>
                          <p className="ml-4">
                            {formatPrice(cartItem.price * cartItem.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {cartItem.variantName}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        {/* Quantity Input */}
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${cartItem.productVariantId}`} className="sr-only">
                            Quantity
                          </label>
                          <input
                            type="number"
                            id={`quantity-${cartItem.productVariantId}`}
                            name="quantity"
                            min="1"
                            value={cartItem.quantity}
                            onChange={(e) => handleQuantityChange(cartItem.productVariantId, parseInt(e.target.value, 10))}
                            className="block w-16 border border-gray-300 rounded-md py-1.5 text-base text-center leading-5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        {/* Remove Item Button */}
                        <div className="flex">
                          <Form method="post">
                            <input type="hidden" name="productVariantId" value={cartItem.productVariantId} />
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
            </Form>
          </div>

          {/* Cart Summary */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            {/* Checkout Button */}
            <div className="mt-6">
              <button
                onClick={handleCheckoutSelected}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Checkout Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
