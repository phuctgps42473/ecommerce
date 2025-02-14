import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin | Orders | eShop" },
    { name: "description", content: "Manage orders" },
  ];
};


// Types for Order data
type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
};

type LoaderData = {
  orders: Order[];
};

export const loader: LoaderFunction = async () => {
  const orders = await getOrders(); // Replace with your actual order data fetching logic
  return Response.json({ orders });
};

// Simulate fetching orders from a database or API
const getOrders = async (): Promise<Order[]> => {
  return [
    {
      id: "123",
      customer: "John Doe",
      email: "john.doe@example.com",
      total: 158,
      status: "Processing",
      date: "2023-11-22",
    },
    {
      id: "124",
      customer: "Jane Smith",
      email: "jane.smith@example.com",
      total: 79,
      status: "Completed",
      date: "2023-11-21",
    },
    {
      id: "125",
      customer: "Peter Jones",
      email: "peter.jones@example.com",
      total: 25,
      status: "Pending",
      date: "2023-11-20",
    },
    // ... more orders
  ];
};

export default function AdminOrders() {
  const { orders } = useLoaderData() as LoaderData;

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
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
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
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {order.customer}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {order.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/orders/${order.id}`}
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
