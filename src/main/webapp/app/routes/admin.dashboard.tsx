import { redirect, json } from "@remix-run/node";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Sidebar from "~/components/admin/Sidebar";
import Overview from "~/components/admin/Overview";
import RecentOrders from "~/components/admin/Orders";
import LowStock from "~/components/admin/Products";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard | eShop" },
    { name: "description", content: "eShop Admin Dashboard" },
  ];
};


export const loader: LoaderFunction = async () => {
  const dashboardData = await getDashboardData(); // Replace with your data fetching
  return Response.json(dashboardData);
};

const getDashboardData = async () => {
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
    // ... data for other sections (customers, marketing, etc.)
  };
};

export default function AdminDashboard() {
  const dashboardData = useLoaderData<typeof loader>();

  return (

    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      {/* Overview Section */}
      <Overview data={dashboardData.overview} />

      {/* Recent Orders Section */}
      <RecentOrders data={dashboardData.recentOrders} />

      {/* Low Stock Products Section */}
      <LowStock data={dashboardData.lowStockProducts} />

      {/* Add other sections here (e.g., Customers, Marketing, Reports) */}
    </main>
  );
}

