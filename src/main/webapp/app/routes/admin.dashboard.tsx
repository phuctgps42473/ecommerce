import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { formatPrice } from "~/utils/format_price"; // Assuming you have a price formatting utility

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard | eShop" },
    { name: "description", content: "eShop Admin Dashboard" },
  ];
};

// Define types for your dashboard data
type OverviewData = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  newCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
};

type Order = {
    id: string;
    customer: string;
    email: string;
    total: number;
    status: string;
    date: string;
  };

type RecentOrdersData = {
    orders: Order[];
};

type Product = {
    id: string;
    name: string;
    stock: number;
  };

type LowStockData = {
    products: Product[];
};


type DashboardData = {
  overview: OverviewData;
  recentOrders: RecentOrdersData;
  lowStockProducts: LowStockData;
};

export const loader: LoaderFunction = async () => {
  const dashboardData = await getDashboardData(); // Replace with your data fetching
  return Response.json(dashboardData);
};

const getDashboardData = async (): Promise<DashboardData> => {
  // Simulate fetching data for the dashboard
  return {
    overview: {
      totalOrders: 125,
      totalRevenue: 15450,
      pendingOrders: 5,
      newCustomers: 20,
      conversionRate: 2.5,
      averageOrderValue: 123.6,
    },
    recentOrders: {
      orders: [
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
      ],
    },
    lowStockProducts: {
      products: [
        { id: "3", name: "Gateron Yellow Switches", stock: 5 },
        { id: "7", name: "Holy Panda Switches", stock: 10 },
      ],
    },
  };
};

export default function AdminDashboard() {
    const dashboardData = useLoaderData() as DashboardData;

  return (
    <main className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        {/* Quick Actions (Optional) */}
        <div className="space-x-4 mt-4 md:mt-0">
          <Link
            to="/admin/products/new"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            View All Orders
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Orders Card */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Total Orders</h2>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview.totalOrders}</p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Total Revenue</h2>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(dashboardData.overview.totalRevenue)}</p>
            </div>

            {/* Pending Orders Card */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-yellow-500">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Pending Orders</h2>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview.pendingOrders}</p>
            </div>
            {/* New Customers Card */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
                <h2 className="text-lg font-medium text-gray-700 mb-2">New Customers</h2>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview.newCustomers}</p>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-indigo-500">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Conversion Rate</h2>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.overview.conversionRate}%</p>
            </div>

            {/* Average Order Value Card */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-teal-500">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Average Order Value</h2>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(dashboardData.overview.averageOrderValue)}</p>
            </div>
        </div>

      {/* Recent Orders Section */}
      <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recentOrders.orders.map((order) => (
                          <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(order.total)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={getstatusClass(order.status)}>{order.status}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Low Stock Products Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Low Stock Products
        </h2>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                  <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.lowStockProducts.products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.stock}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}

const getstatusClass = (status: string) => {
    const baseStyle = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
      case "Processing":
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case "Completed":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "Pending":
        return `${baseStyle} bg-gray-100 text-gray-800`;
      case "Shipped":
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case "Cancelled":
        return `${baseStyle} bg-red-100 text-red-800`;
      default:
        return baseStyle;
    }
}
