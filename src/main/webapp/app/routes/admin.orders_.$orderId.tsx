import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { formatPrice } from "~/utils/format_price"; // Make sure you have this
import apiFetcher from "~/utils/fetcher.server"; //And this.
import { getAccessToken } from "~/utils/token.server";


// --- Types ---
type Address = {
  id: number;
  province: string;
  city: string;
  district: string;
  ward: string;
  specificAddress: string;
};

type ProductVariant = {
  id: number;
  name: string;
  sku: string;
  gtin: string;
  image: string;
  price: number;
};

type Promotion = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  promotionType: string; // Consider an enum if you have fixed types
  promotionValue: number;
} | null; // Allows for no promotion

type CustomerOrderDetail = {
  productVariant: ProductVariant;
  quantity: number;
  subtotal: number;
  promotion: Promotion;
};

type Order = {
  id: number;
  address: Address;
  customerOrderDetailList: CustomerOrderDetail[];
  shipmentFee: number;
  customerOrderStatus: string; // Consider an enum here too
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
};

type LoaderData = {
  order: Order;
};

// --- Meta Function ---

export const meta: MetaFunction = ({ data }) => {
  const order = (data as LoaderData)?.order;
  if (!order) {
    return [{ title: 'Order Not Found | eShop Admin' }];
  }
  return [
    { title: `Order #${order.id} | eShop Admin` },
    { name: 'description', content: `Details for order #${order.id}` },
  ];
};

// --- Loader ---

export async function loader({ request, params }: LoaderFunctionArgs) {
  const orderId = params.orderId;
  invariant(orderId, "Expected params.orderId");

  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate"); // Or wherever your admin login is
  }

  try {
    // Replace with your actual API call.  Crucially, include the access token.
    const res = await apiFetcher(`/admin/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    const order: Order = res.data.data; // Assuming your API returns the order directly

    if (!order) {
      throw new Response("Order not found", { status: 404 });
    }

    return Response.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    // Handle errors appropriately, e.g., redirect to an error page, or show a 404.
    throw new Response("Failed to load order", { status: 500 });
  }
}

// --- Action ---
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const orderId = params.orderId;
  invariant(orderId, "Expected params.orderId");

  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate");
  }

  const formData = await request.formData();
  const newStatus = formData.get("newStatus");

  if (!newStatus || typeof newStatus !== "string") {
    return Response.json({ error: "Invalid status provided." }, { status: 400 });
  }

  try {
    // Replace with your actual API endpoint and method
    const response = await apiFetcher(`/orders/${orderId}/status`, {
      method: "PUT",  // Or PATCH, depending on your API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: { status: newStatus },
    });
    // Check for successful response.  apiFetcher should throw, but it's good to be sure.
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }

    // Redirect back to the order details page
    return redirect(`/admin/orders/${orderId}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    return Response.json({ error: "Failed to update order status." }, { status: 500 });
  }
};

// --- Main Component ---

export default function AdminOrderDetailPage() {
  const { order } = useLoaderData() as LoaderData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order #{order.id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Order Details
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details and status about the order.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Order Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.id}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Order Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.customerOrderStatus}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Total Amount
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatPrice(order.totalPrice)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Shipping Fee</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatPrice(order.shipmentFee)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Update Status Form */}
          <Form method="post" className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Update Order Status</h3>
            <div className="flex items-center space-x-4">
              <select
                name="newStatus"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="PREPARING">Preparing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                {/* Add other statuses as needed */}
              </select>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Status
              </button>
            </div>
          </Form>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Shipping Address
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Shipping Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Customer&apos;s shipping address.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.address.specificAddress}, {order.address.ward}, {order.address.district}, {order.address.city}, {order.address.province}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
            Order Items
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.customerOrderDetailList.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={item.productVariant.image}
                        alt={item.productVariant.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* You might link to the product page here */}
                      {item.productVariant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.productVariant.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.productVariant.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.subtotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.promotion ? item.promotion.name : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
