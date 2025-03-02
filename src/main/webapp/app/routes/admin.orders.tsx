import type { MetaFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, redirect } from "@remix-run/react";
import apiFetcher from "~/utils/fetcher.server";
import { formatPrice } from "~/utils/format_price";
import { getAccessToken } from "~/utils/token.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin | Orders | eShop" },
    { name: "description", content: "Manage orders" },
  ];
};


// Types for Order data
type Order = {
  orderId: string;
  orderStatus: string;
  totalPrice: number;
  createdAt: string;
};

type LoaderData = {
  orders: Order[];
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await getAccessToken(request);
  if (accessToken === null) {
    return redirect("/admin/authenticate");
  }
  try {
    const res = await apiFetcher("/admin/orders", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
    const orders = res.data.data.content;
    return Response.json({ orders });
  } catch (error) {
    console.log("ERROR", error.response);
  }
};


export default function AdminOrders() {
  const { orders } = useLoaderData() as LoaderData;

  console.log(orders);

  return (
    <main className="flex-1 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        {/* Add any filtering or sorting options here */}
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatPrice(order.totalPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.createdAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/orders/${order.orderId}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
