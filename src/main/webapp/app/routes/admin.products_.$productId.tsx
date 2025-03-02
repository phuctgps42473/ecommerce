import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useState, useEffect } from "react";
import apiFetcher from "~/utils/fetcher.server"; // Replace with your fetcher
import { getAccessToken } from "~/utils/token.server";

// --- Types ---
type ProductVariant = {
  name: string;
  image: string;
  price: number;
  sku: string;
  gtin: string;
  stock: number;
};

// Define Product type to match your API data
type Product = {
  productCategoryId: number;
  productBrand: string;
  totalStock: string; // Consider making this a number if it represents a numerical quantity
  productName: string;
  productProfileImage: string;
  description: string;
  dimensionsMM: string;
  weight: string;
  propertyIdList: number[]; // Array of property IDs
  productVariantList: ProductVariant[];
};


type LoaderData = {
  product: Product | null;
  categories: { id: number; categoryName: string }[];
  properties: { id: number; propertyName: string; propertyValue: string }[];
};

type ActionData = {
  errors?: {
    productName?: string;
    description?: string;
    // ... other fields
    variants?: string; // General variant error
    variantErrors?: { [index: number]: { name?: string; price?: string, image?: string, sku?: string; gtin?: string, stock?: string; } }; //Specific errors for each variant
    propertyErrors?: { [index: number]: { propertyId?: string } }
  };
  success?: boolean;
};

// --- Meta ---
export const meta: MetaFunction = ({ params }) => {
  return [
    {
      title: params.productId
        ? "Edit Product | eShop Admin"
        : "New Product | eShop Admin",
    },
  ];
};

// --- Loader ---
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const productId = params.productId;
  const accessToken = await getAccessToken(request);

  if (!accessToken || typeof accessToken !== 'string') {
    return redirect('/admin/authenticate');
  }

  let product: Product | null = null;

  // Fetch existing product if editing
  if (productId && productId !== "new") {
    invariant(typeof productId === "string", "Expected productId to be a string");
    try {
      const productRes = await apiFetcher(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      product = productRes.data;

    } catch (error) {
      console.error("Failed to fetch product:", error);
      throw new Response("Product not found", { status: 404 });
    }
  }


  let properties: LoaderData["properties"] = [];
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId");
  if (categoryId !== null) {
    try {

      const propertiesRes = await apiFetcher("/admin/properties", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });// Replace with your properties endpoint
      properties = propertiesRes.data.data;
    } catch (error) {
      console.log("CANNOT FETCH PROPERTIES OF CATEGORY ID: " + categoryId);

    }
  }


  try {

    const categoriesRes = await apiFetcher("/admin/categories", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const categories = categoriesRes.data.data;
    const data: LoaderData = { product, categories, properties };
    return Response.json(data);
  } catch (error) {
    console.log("CANNOT FETCH CATEGORY");
    return Response.error();
  }


};

// --- Action ---
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const productId = params.productId; // "new" or the product ID
  const accessToken = await getAccessToken(request);

  if (!accessToken || typeof accessToken !== 'string') {
    return redirect('/admin/authenticate');
  }

  const formData = await request.formData();

  // Convert FormData to a plain object to more easily work with.
  const getFormValue = (key: string) => {
    const value = formData.get(key);
    return value === null ? undefined : value.toString();
  };
  const getFormArray = (key: string) => {
    const values = formData.getAll(key);
    return values.map(value => value.toString());
  }

  const actionType = getFormValue("actionType");

  if (actionType === "GET_PROPERTIES") {
    const categoryId = getFormValue("categoryId");
    try {
      const res = await apiFetcher("/admin/properties?category_id=" + categoryId, {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      });
      const properties = res.data.data;
      return Response.json({ properties })
    } catch (error) {
      console.log(error.response)
      return Response.json({ properties: [] })
    }
  }

  const productData: Partial<Product> = {
    productName: getFormValue("productName"),
    description: getFormValue("description"),
    productCategoryId: parseInt(getFormValue("productCategoryId") || "0", 10), // Convert to number
    productBrand: getFormValue("productBrand"),
    productProfileImage: getFormValue("productProfileImage"),
    dimensionsMM: getFormValue("dimensionsMM"),
    weight: getFormValue("weight"),
    propertyIdList: getFormArray("propertyIdList").map(Number),
    productVariantList: [], // We'll populate this below.
    totalStock: getFormValue("totalStock")
  };
  // Handle Variants.  This is now *much* more robust.
  const variantNames = getFormArray("variantName");
  const variantImages = getFormArray("variantImage");
  const variantPrices = getFormArray("variantPrice");
  const variantSkus = getFormArray("variantSku");
  const variantGtins = getFormArray("variantGtin");
  const variantStocks = getFormArray("variantStock");

  for (let i = 0; i < variantNames.length; i++) {
    productData.productVariantList!.push({
      name: variantNames[i],
      image: variantImages[i],
      price: parseFloat(variantPrices[i] || "0"), // Convert to number, default to 0
      sku: variantSkus[i],
      gtin: variantGtins[i],
      stock: parseInt(variantStocks[i] || "0", 10), // Convert to number, default to 0
    });
  }

  // --- Validation ---
  const errors: ActionData["errors"] = {};
  //Basic Validation
  if (!productData.productName) {
    errors.productName = "Product name is required";
  }
  if (productData.productName && productData.productName.length > 255) {
    errors.productName = "Product name must be less than 255";
  }
  if (!productData.description) {
    errors.description = "Description is required";
  }

  //Variant Validations.
  const variantErrors = [];
  let hasVariantErrors = false;

  for (let i = 0; i < productData.productVariantList!.length; i++) {
    const variant = productData.productVariantList![i];
    const currentVariantErrors: any = {};

    if (!variant.name) {
      currentVariantErrors.name = "Variant name is required";
      hasVariantErrors = true;
    }
    if (variant.name && variant.name.length > 255) {
      currentVariantErrors.name = "Variant name must less than 255";
      hasVariantErrors = true;
    }

    if (!variant.sku) {
      currentVariantErrors.sku = "SKU is required";
      hasVariantErrors = true;
    }
    if (variant.sku && variant.sku.length > 255) {
      currentVariantErrors.sku = "SKU must less than 255";
      hasVariantErrors = true;
    }

    if (isNaN(variant.price) || variant.price <= 0) {
      currentVariantErrors.price = "Price must be a positive number";
      hasVariantErrors = true;
    }

    if (isNaN(variant.stock) || variant.stock < 0) {
      currentVariantErrors.stock = "Stock must be a non-negative number";
      hasVariantErrors = true;
    }
    if (variant.gtin && variant.gtin.length > 255) {
      currentVariantErrors.gtin = "Stock must be less than 255";
      hasVariantErrors = true;
    }

    if (Object.keys(currentVariantErrors).length > 0) {
      variantErrors[i] = currentVariantErrors;
    }
  }

  if (hasVariantErrors) {
    errors.variantErrors = variantErrors;
    errors.variants = "Some variants have errors"; // General variant error
  }
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    let method = "POST";
    let url = "/admin/products";
    if (productId && productId !== "new") {
      method = "PUT";
      url = `/admin/products/${productId}`;
    }
    await apiFetcher(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: productData, // Send the correctly structured data
    });

    return Response.json({ success: true, }, { status: 200 });

  } catch (error) {
    console.error("Error creating/updating product:", error);
    return Response.json(
      { errors: { general: "An unexpected error occurred." } }, //Generic error
      { status: 500 }
    );
  }
};


// --- Component ---

export default function AdminProductForm() {
  const { product, categories, properties } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;
  const navigate = useNavigate();
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.productVariantList || [{ name: "", image: "", price: 0, sku: "", gtin: "", stock: 0 }]
  );
  const submit = useSubmit();

  useEffect(() => {
    if (product?.productVariantList && product.productVariantList.length > 0) {
      setVariants(product.productVariantList);
    }
  }, [product]);

  const addVariant = () => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { name: "", image: "", price: 0, sku: "", gtin: "", stock: 0 },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prevVariants => {
      const newVariants = [...prevVariants];
      const updatedVariant = { ...newVariants[index], [field]: value };
      newVariants[index] = updatedVariant;
      return newVariants;
    });
  };

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const categoryId = e.target.value;
    const form = new FormData();
    form.append("categoryId", categoryId);
    submit(form, { method: "GET" });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {product ? "Edit Product" : "Add New Product"}
      </h1>

      <Form method="post" className="space-y-8">
        {/* Basic Product Information */}
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="pt-8">
            <h2 className="text-xl font-semibold leading-6 text-gray-900">Product Information</h2>
            <p className="mt-1 text-sm text-gray-500">Basic information about the product.</p>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    autoComplete="given-name"
                    defaultValue={product?.productName}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {actionData?.errors?.productName && (
                    <p className="mt-2 text-sm text-red-600">{actionData.errors.productName}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="productCategoryId" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    onChange={handleChange}
                    id="productCategoryId"
                    name="productCategoryId"
                    autoComplete="category-name"
                    defaultValue={product?.productCategoryId}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="productBrand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="productBrand"
                    id="productBrand"
                    defaultValue={product?.productBrand}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="productProfileImage" className="block text-sm font-medium text-gray-700">
                  Product Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="productProfileImage"
                    id="productProfileImage"
                    defaultValue={product?.productProfileImage}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="dimensionsMM" className="block text-sm font-medium text-gray-700">
                  Dimensions (mm)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="dimensionsMM"
                    id="dimensionsMM"
                    defaultValue={product?.dimensionsMM}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    defaultValue={product?.weight}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="totalStock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Stock
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="totalStock"
                    name="totalStock"
                    defaultValue={product?.totalStock}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={product?.description}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {actionData?.errors?.description && (
                    <p className="mt-2 text-sm text-red-600">{actionData.errors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Properties */}
        <div className="mt-8 pt-8 border-t border-gray-200 ">
          <h2 className="text-xl font-semibold leading-6 text-gray-900">Product Properties</h2>
          <p className="mt-1 text-sm text-gray-500">Select properties of the product.</p>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 max-h-[500px] overflow-scroll">
            <div className="sm:col-span-6"> {/* Use full width */}
              {properties.reduce((ac, p) => {
                if (!ac.includes(p.propertyName)) {
                  ac.push(p.propertyName);
                }
                return ac;
              }, new Array<string>()).map(name => (
                <div key={name} className="mb-4"> {/* Add margin-bottom for spacing */}
                  <label className="block text-sm font-medium text-gray-700">{name}:</label> {/* Use block display */}
                  <div className="mt-1 flex flex-wrap gap-4"> {/* Wrap properties */}
                    {properties.filter(p => p.propertyName === name).map(p => (
                      <div key={p.id} className="flex items-center"> {/* Wrap each property */}
                        <input
                          id={`property-${p.id}`}
                          name={`propertyIdList`}
                          type="checkbox"
                          value={p.id.toString()} //use to string
                          defaultChecked={product?.propertyIdList.includes(p.id)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`property-${p.id}`} className="ml-2 block text-sm font-medium text-gray-700">
                          {p.propertyValue}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Product Variants */}
        <div className="mt-8 pt-8">
          <h2 className="text-xl font-semibold leading-6 text-gray-900">Product Variants</h2>
          <p className="mt-1 text-sm text-gray-500">Manage variants of this product.</p>
          {actionData?.errors?.variants && (
            <p className="text-red-600 text-sm mb-2">{actionData.errors.variants}</p>
          )}
          <div className="mt-6 space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border border-gray-300 rounded-md p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Variant {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`variantName-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Variant Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={`variantName-${index}`}
                        name={`variantName`}
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(index, "name", e.target.value)
                        }
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {actionData?.errors?.variantErrors?.[index]?.name && (
                        <p className="mt-2 text-sm text-red-600">
                          {actionData.errors.variantErrors[index].name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`variantImage-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image URL
                    </label>
                    <div className="mt-1">
                      <input
                        type="url"
                        id={`variantImage-${index}`}
                        name={`variantImage`}
                        value={variant.image}
                        onChange={(e) =>
                          updateVariant(index, "image", e.target.value)
                        }
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {actionData?.errors?.variantErrors?.[index]?.image && (
                        <p className="mt-2 text-sm text-red-600">
                          {actionData.errors.variantErrors[index].image}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`variantPrice-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id={`variantPrice-${index}`}
                        name={`variantPrice`}
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "price",
                            parseFloat(e.target.value)
                          )
                        }
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {actionData?.errors?.variantErrors?.[index]?.price && (
                        <p className="mt-2 text-sm text-red-600">
                          {actionData.errors.variantErrors[index].price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`variantSku-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      SKU
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={`variantSku-${index}`}
                        name={`variantSku`}
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(index, "sku", e.target.value)
                        }
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {actionData?.errors?.variantErrors?.[index]?.sku && (
                        <p className="mt-2 text-sm text-red-600">
                          {actionData.errors.variantErrors[index].sku}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor={`variantGtin-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      GTIN
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={`variantGtin-${index}`}
                        name={`variantGtin`}
                        value={variant.gtin}
                        onChange={(e) =>
                          updateVariant(index, "gtin", e.target.value)
                        }
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {actionData?.errors?.variantErrors?.[index]?.gtin && (
                        <p className="mt-2 text-sm text-red-600">
                          {actionData.errors.variantErrors[index].gtin}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor={`variantStock-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stock
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id={`variantStock-${index}`}
                        name={`variantStock`}
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "stock",
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {actionData?.errors?.variantErrors?.[index]?.stock && (
                        <p className="mt-2 text-sm text-red-600">
                          {actionData.errors.variantErrors[index].stock}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Variant
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      </Form>
    </main>
  );
}
