import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Form, redirect, Link, Navigate, useNavigate, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useState } from "react";
import type { Product } from "~/types/product";  // Make sure your Product type includes variants
import apiFetcher from "~/utils/fetcher.server";
import { getAccessToken } from "~/utils/token.server";
import { SELECTED_ITEMS } from "~/constants";

export const meta: MetaFunction = ({ data }) => {
  // ... (Your existing meta function - no changes here) ...
  const product = (data as LoaderData)?.product;

  if (!product) {
    return [{ title: "Product Not Found | eShop" }];
  }

  return [
    { title: `${product.productName} | eShop` },
    { name: "description", content: product.description },
    // Add Open Graph meta tags for social sharing
    { property: "og:title", content: product.productName },
    { property: "og:description", content: product.description },
    { property: "og:image", content: product.productProfileImage },
    { property: "og:url", content: `/product/${product.id}` },
    { property: "og:type", content: "product" },
    // Add Twitter Card meta tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: product.productName },
    { name: "twitter:description", content: product.description },
    { name: "twitter:image", content: product.productProfileImage },
  ];
};

type LoaderData = {
  product: Product;
};

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;

  invariant(slug, "Missing product Slug");

  const res = await apiFetcher("/public/products/" + slug);
  const product = res.data;

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const data: LoaderData = { product };
  return Response.json(data);
};


// Assuming you have a separate checkout route (e.g., /checkout)
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const quantity = formData.get("quantity");
  const variantId = formData.get("variantId");
  const actionType = formData.get("actionType");

  invariant(productId, "Product ID is required");
  invariant(quantity, "Quantity is required");
  invariant(variantId, "Variant SKU is required");

  const accessToken = await getAccessToken(request);

  if (typeof accessToken !== "string") {
    return redirect("/login");
  }

  try {
    await apiFetcher("/cart", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken
      },
      data: {
        productVariantId: variantId,
        quantity
      }
    });

    return redirect("/cart");
  } catch (error) {
    console.error("FAILED: ", error);
    // TODO: HANDLE ERROR
    return {};
  }
}



// --- Star Rating Component (No changes needed) ---
function StarRating({ rating }: { rating: number }) {
  //COPIED
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <svg
          key={index}
          className="w-4 h-4 text-yellow-400 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.94 6.04 6.56.96-4.75 4.62 1.13 6.54L10 15.53l-5.88 3.63 1.13-6.54L.5 8l6.56-.96L10 1z" />
        </svg>
      ))}
      {halfStar && (
        <svg
          className="w-4 h-4 text-yellow-400 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.94 6.04 6.56.96-4.75 4.62 1.13 6.54L10 15.53V1z" />
        </svg>
      )}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, index) => (
        <svg
          key={`empty-${index}`}
          className="w-4 h-4 text-gray-400 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.94 6.04 6.56.96-4.75 4.62 1.13 6.54L10 15.53l-5.88 3.63 1.13-6.54L.5 8l6.56-.96L10 1z" />
        </svg>
      ))}
    </div>
  );

}
// --- Main Component ---

export default function ProductDetailPage() {
  const { product } = useLoaderData<LoaderData>();
  const [currentImage, setCurrentImage] = useState(product.productProfileImage);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(product.productVariantList[0].id); // Store selected SKU
  const submit = useSubmit();


  const handleImageChange = (image: string) => {
    setCurrentImage(image);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  function handleBuyNow() {
    localStorage.setItem(SELECTED_ITEMS, JSON.stringify([selectedVariantId]));
    const form = new FormData();
    form.set("productId", String(product.id));
    form.set("quantity", String(quantity));
    form.set("variantId", String(selectedVariantId));
    form.set("actionType", "buyNow");
    submit(form, { method: "POST" })
  }

  // Find the currently selected variant
  const selectedVariant = product.productVariantList.find(
    (variant) => variant.id === selectedVariantId
  );
  // Get the price from the selected variant, fall back to the first variant if none selected
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.productVariantList[0].price;


  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariantId(Number(event.target.value));
    const variant = product.productVariantList.find(v => v.id === Number(event.target.value));
    if (variant) {
      setCurrentImage(variant.image); // Update image on variant change
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* --- Image Gallery --- */}
        <div>
          <div className="relative">
            <img
              src={currentImage}
              alt={product.productName}
              className="w-full rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {product.productVariantList?.map((pv) => (
              <button
                key={pv.sku}
                onClick={() => handleImageChange(pv.image)}
                className={`border-2 rounded-md overflow-hidden hover:border-blue-500 transition-all duration-200 ${currentImage === pv.image ? "border-blue-500" : "border-gray-300"
                  }`}
              >
                <img
                  src={pv.image}
                  alt={`Thumbnail of ${pv.name}`}
                  className="w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- Product Details --- */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.productName}
          </h1>
          <p className="text-lg text-gray-600">{product.description}</p>
          <p className="text-3xl font-bold text-blue-600 mt-4">
            ${currentPrice.toFixed(2)} {/* Use currentPrice here */}
          </p>

          {/* Variant Selector */}
          <div className="mt-6">
            <label
              htmlFor="variant"
              className="block text-sm font-medium text-gray-700"
            >
              Variant:
            </label>
            <select
              id="variant"
              name="variant"
              value={selectedVariantId}
              onChange={handleVariantChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {product.productVariantList.map((variant) => (
                <option key={variant.sku} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div className="mt-6">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 w-20 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center"
            />
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <Form method="post" className="mt-4 flex gap-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value={quantity} />
            <input type="hidden" name="variantId" value={selectedVariantId} />

            <button
              type="submit"
              name="actionType"
              value="addToCart"
              className="flex-1 px-6 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 px-6 py-3 text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Buy Now
            </button>
          </Form>

          {/* Product Specifications */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {product.productPropertyList.map(({ property }) => (
                <div key={property.propertyName} className="sm:col-span-1">
                  <dt className="text-base font-medium text-gray-500">
                    {property.propertyName}
                  </dt>
                  <dd className="mt-1 text-base text-gray-900">
                    {property.propertyValue}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Link to="/modal">Go</Link>

          {/* --- Reviews --- */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            {/* ... (your existing reviews display code) ... */}
            {product.reviews && product.reviews.length > 0 ? (
              <div>
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900">
                        {review.author}
                      </h4>
                      <span className="ml-2">
                        <StarRating rating={review.rating} />
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          {/* Add Review Form (Optional) */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
            {/* ... (your existing review form code) ... */}
            <Form method="post" className="space-y-4">
              <input type="hidden" name="productId" value={product.id} />
              <div>
                <label htmlFor="review-author" className="sr-only">
                  Your Name
                </label>
                <input
                  type="text"
                  id="review-author"
                  name="author"
                  placeholder="Your Name"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="review-rating" className="sr-only">
                  Rating
                </label>
                <select
                  id="review-rating"
                  name="rating"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label htmlFor="review-comment" className="sr-only">
                  Review
                </label>
                <textarea
                  id="review-comment"
                  name="comment"
                  rows={4}
                  placeholder="Write your review..."
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit Review
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
