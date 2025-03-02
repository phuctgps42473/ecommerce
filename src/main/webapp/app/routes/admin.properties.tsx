import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import apiFetcher from "~/utils/fetcher.server";
import { getAccessToken } from "~/utils/token.server";

// --- Types ---

type Property = {
  productCategoryId: number;
  propertyId: number;
  propertyName: string;
  propertyValue: string;
};

type Category = {
  id: number;
  categoryName: string;
};

type LoaderData = {
  properties: Property[];
  categories: Category[];
};

type ActionData = {
  errors?: {
    productCategoryId?: string;
    propertyName?: string;
    propertyValue?: string;
    general?: string;
  };
  success?: boolean;
};

// --- Meta ---

export const meta: MetaFunction = () => {
  return [{ title: "Product Properties | eShop Admin" }];
};

// --- Loader ---

export async function loader({ request }: LoaderFunctionArgs) {
  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate");
  }

  try {
    const categoriesRes = await apiFetcher("/admin/categories", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const categories: Category[] = categoriesRes.data.data;
    let properties: Property[] = [];

    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    if (categoryId !== null) {
      const propertiesRes = await apiFetcher("/admin/properties?categoryId=" + categoryId, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      properties = propertiesRes.data.data;
    }

    return Response.json({ categories, properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    // Handle errors, e.g., redirect to an error page
    throw new Response("Failed to load properties", { status: 500 });
  }
}

// --- Action ---

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate");
  }

  const formData = await request.formData();
  const productCategoryId = formData.get("productCategoryId");
  const propertyName = formData.get("propertyName");
  const propertyValue = formData.get("propertyValue");

  invariant(typeof productCategoryId === "string");
  invariant(typeof propertyName === "string");
  invariant(typeof propertyValue === "string");

  // --- Validation ---
  const errors: ActionData["errors"] = {};
  if (
    !productCategoryId ||
    typeof productCategoryId !== "string" ||
    isNaN(parseInt(productCategoryId))
  ) {
    errors.productCategoryId = "A valid category is required.";
  }
  if (!propertyName || typeof propertyName !== "string" || propertyName.trim().length === 0) {
    errors.propertyName = "Property name is required.";
  }
  if (propertyName && propertyName.length > 255) {
    errors.propertyName = "Property name must be less than 255";
  }
  if (!propertyValue || typeof propertyValue !== "string" || propertyValue.trim().length === 0) {
    errors.propertyValue = "Property value is required.";
  }
  if (propertyValue && propertyValue.length > 255) {
    errors.propertyName = "Property value must be less than 255";
  }


  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    // --- API Call ---
    const response = await apiFetcher("/admin/properties", {
      // Replace with your actual endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        productCategoryId: parseInt(productCategoryId),
        propertyName: propertyName.trim(),
        propertyValue: propertyValue.trim(),
      },
    });

    if (!response.status) {
      const errorData = await response.data;
      return Response.json({ errors: errorData.errors }, { status: response.status });
    }

    // Redirect after successful creation
    return redirect("/admin/properties");
  } catch (error) {
    console.error("Error creating property:", error);
    return Response.json(
      { errors: { general: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
};

// --- Component ---

export default function AdminPropertiesPage() {
  const { properties, categories } = useLoaderData() as LoaderData;
  console.log(properties);
  const actionData = useActionData() as ActionData;
  const submit = useSubmit();

  function handleChangeCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    const form = new FormData();
    const categoryId = e.target.value;
    if (categoryId.length !== 0) {
      form.append("categoryId", e.target.value);
    }
    submit(form, { method: "GET" });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Product Properties
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Existing Properties
          </h2>
          {/* Filter by Category */}
          <div className="mb-4">
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">Filter by Category:</label>
            <select
              id="categoryFilter"
              onChange={handleChangeCategory}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          {/* TODO: suggest PROPERTIES */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-scroll">
              {properties.map((property) => (
                <li key={property.propertyId} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {property.propertyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Value: {property.propertyValue}
                      </p>
                      <p className="text-sm text-gray-500">
                        Category ID: {property.productCategoryId}
                      </p>
                    </div>
                    {/* Add Edit/Delete buttons here if needed */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Add New Property Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Property
          </h2>
          <Form method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {actionData?.errors?.general && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {actionData.errors.general}</span>
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="productCategoryId"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="productCategoryId"
                name="productCategoryId"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {actionData?.errors?.productCategoryId && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.errors.productCategoryId}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="propertyName"
                className="block text-sm font-medium text-gray-700"
              >
                Property Name
              </label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {actionData?.errors?.propertyName && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.errors.propertyName}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="propertyValue"
                className="block text-sm font-medium text-gray-700"
              >
                Property Value
              </label>
              <input
                type="text"
                id="propertyValue"
                name="propertyValue"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {actionData?.errors?.propertyValue && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.errors.propertyValue}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Property
              </button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
