import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";
import apiFetcher from "~/utils/fetcher.server"; // Replace with your fetcher
import { getAccessToken } from "~/utils/token.server";


// --- Types ---
type Product = {
  id: number;
  productCategory: string;  // Consider using an enum
  productName: string;
  totalStock: number;
};

type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

type ApiResponse = {
  content: Product[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page number
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

type LoaderData = {
  products: Product[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

// --- Meta ---

export const meta: MetaFunction = () => {
  return [
    { title: "Admin | Products | eShop" },
    { name: "description", content: "Manage products" },
  ];
};

// --- Loader ---

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate"); // Or wherever your admin login is
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const size = parseInt(url.searchParams.get("size") || "10", 10); // Default page size

  try {
    // Replace with your actual API call.  Crucially, include pagination parameters.
    const res = await apiFetcher(`/admin/products?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    const apiResponse: ApiResponse = res.data.data; // Use the ApiResponse type
    const data: LoaderData = {
      products: apiResponse.content,
      pageable: apiResponse.pageable,
      totalElements: apiResponse.totalElements,
      totalPages: apiResponse.totalPages,
      currentPage: apiResponse.number
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    // Handle errors (e.g., redirect to an error page, show a message)
    return Response.json({ products: [], pageable: {}, totalElements: 0 }, { status: 500 });
  }
};

// --- Component ---

export default function AdminProducts() {
  const { products, pageable, currentPage, totalPages } = useLoaderData() as LoaderData;
  const [pageSize, setPageSize] = useState(pageable.pageSize);

  // Function to handle page changes.  This is CRUCIALLY important.
  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.location.href = url.toString(); // Navigate to the new URL
  };
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);

    const url = new URL(window.location.href);
    url.searchParams.set('page', '0');
    url.searchParams.set('size', newSize.toString());
    window.location.href = url.toString();
  };
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 lg:mt-0"
        >
          Add Product
        </Link>
      </div>
      {/* Page Size Selector */}
      <div className="my-4">
        <label htmlFor="page-size" className="mr-2">Items per page:</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border rounded px-2 py-1"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productCategory}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Edit</Link>
                  {/* Add Delete button (with confirmation) here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        {currentPage > 0 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Previous
          </button>
        )}

        {/* Display page numbers (optional, but good for UX) */}
        {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 mx-1 rounded-md ${page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
          >
            {page + 1}
          </button>
        ))}

        {(currentPage < totalPages - 1) && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}
