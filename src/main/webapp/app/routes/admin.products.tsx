import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
};

export const loader: LoaderFunction = async () => {
  const products = await getProducts(); // Replace with your actual product data fetching logic
  return Response.json({ products });
};

// Simulate fetching products from a database or API
const getProducts = async (): Promise<Product[]> => {
  return [
    {
      id: "1",
      name: "Keychron K2",
      price: 79,
      stock: 50,
      imageUrl: "/images/keychron-k2.webp",
      category: "Keyboards",
    },
    {
      id: "2",
      name: "GMK Botanical Keycaps",
      price: 129,
      stock: 10,
      imageUrl: "/images/gmk-botanical.webp",
      category: "Keycaps",
    },
    {
      id: "3",
      name: "Gateron Yellow Switches",
      price: 25,
      stock: 5,
      imageUrl: "/images/gateron-yellow.webp",
      category: "Switches",
    },
    // ... more products
  ];
};

export default function AdminProducts() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <main className="flex-1 p-8">
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 lg:mt-0"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.stock}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
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
