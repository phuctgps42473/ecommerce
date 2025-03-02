import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import apiFetcher from "~/utils/fetcher.server";
import { getAccessToken } from "~/utils/token.server";

// --- Types ---

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

type LoaderData = {
  categories: Category[];
};

type ActionData = {
  errors?: {
    name?: string;
    slug?: string;
    description?: string;
    general?: string;
  };
  success?: boolean;
};

// --- Meta ---

export const meta: MetaFunction = () => {
  return [{ title: "Product Categories | eShop Admin" }];
};

// --- Loader ---

export async function loader({ request }: LoaderFunctionArgs) {
  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate"); // Or your admin login route
  }

  try {
    const response = await apiFetcher("/admin/categories", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }); // Replace with your categories endpoint
    const categories: Category[] = response.data.data;
    return Response.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Handle errors appropriately
    throw new Response("Failed to load categories", { status: 500 });
  }
}

// --- Action ---

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = await getAccessToken(request);
  if (!accessToken || typeof accessToken !== "string") {
    return redirect("/admin/authenticate");
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const slug = formData.get("slug");
  const description = formData.get("description");

  invariant(typeof name === "string");
  invariant(typeof slug === "string");
  invariant(typeof description === "string");

  // --- Validation ---
  const errors: ActionData["errors"] = {};

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        errors.name = "Category name is required.";
    }
     if (name && name.length > 255) {
          errors.name = "Category name must be less than 255.";
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
        errors.slug = "Category slug is required.";
    }
     if (slug && slug.length > 255) {
          errors.slug = "Category slug must be less than 255.";
    }

    if (description && typeof description === "string" && description.length > 255) {
        errors.description = "Description must be less than 255 characters.";
    }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    // --- API Call ---
    const response = await apiFetcher("/admin/categories", {
      // Replace with your actual endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description ? description.trim() : null, // Allow null description
      },
    });

    // Redirect after successful creation
    return redirect("/admin/categories"); // Redirect to the categories list
  } catch (error) {
    console.error("Error creating category:", error);
     return Response.json(
      { errors: { general: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
};

// --- Component ---

export default function AdminCategoriesPage() {
  const { categories } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Product Categories
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Existing Categories
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Slug: {category.slug}
                      </p>
                      <p className="text-sm text-gray-500">
                        Description: {category.description || "N/A"}
                      </p>
                    </div>
                    {/* Add Edit/Delete buttons here if needed */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Add New Category Form */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Category
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {actionData?.errors?.name && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.errors.name}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {actionData?.errors?.slug && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.errors.slug}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {actionData?.errors?.description && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.errors.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Category
              </button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
