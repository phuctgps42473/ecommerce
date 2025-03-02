import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Order Confirmation | eShop" },
    {
      name: "description",
      content: "Confirmation of your recent order.",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const orderId = params.orderId;

  return Response.json({ orderId });
}

export default function OrderConfirmation() {
  const {orderId} = useLoaderData();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Your order has been placed and is being prepared.
        </p>
        <p className="mt-2 text-gray-500">
          Your order number is:{" "}
          <span className="font-medium text-gray-900">{orderId}</span>
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders" // Assuming you have an "orders" route to view order history
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
