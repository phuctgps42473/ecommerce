import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { useState } from "react";

import type { ProductDetails } from "~/types";

// Simulate fetching product data from a database or API
const getProductById = async (id: string): Promise<ProductDetails | null> => {
  const products: ProductDetails[] = [
    {
      id: "1",
      name: "Keychron K2",
      description:
        "A 75% layout (84-key) wireless mechanical keyboard with a unique Mac layout. It offers both Bluetooth and wired connection options and is compatible with macOS, Windows, iOS, and Android.",
      price: 79,
      imageUrl: "/images/keychron-k2.webp",
      category: "Keyboards",
      images: [
        "/images/keychron-k2.webp",
        "/images/keychron-k2-1.webp",
        "/images/keychron-k2-2.webp",
        "/images/keychron-k2-3.webp",
      ],
      details: {
        Connectivity: "Wireless (Bluetooth) or Wired (USB-C)",
        Layout: "75% (84 Keys)",
        Backlight: "White LED",
        Switches: "Gateron G Pro (Red, Blue, or Brown)",
        Keycaps: "ABS, Laser-etched",
        Compatibility: "macOS, Windows, iOS, Android",
        Dimensions: "317 x 129 x 38.5 mm",
        Weight: "663g",
      },
      reviews: [
        {
          author: "John Doe",
          rating: 5,
          comment: "This keyboard is amazing! I love the feel of the keys and the build quality is excellent.",
        },
        {
          author: "Jane Smith",
          rating: 4,
          comment: "Great keyboard for the price. I wish the backlight was RGB, but overall I'm very happy with it.",
        },
      ],
    },
    {
      id: "2",
      name: "GMK Botanical Keycaps",
      description:
        "A premium keycap set designed by Hazzy. The set features a calming green and off-white color scheme inspired by nature. It is made of durable PBT plastic with dye-sublimated legends.",
      price: 129,
      imageUrl: "/images/gmk-botanical.webp",
      category: "Keycaps",
      images: [
        "/images/gmk-botanical.webp",
        "/images/gmk-botanical-1.webp",
        "/images/gmk-botanical-2.webp",
        "/images/gmk-botanical-3.webp",
      ],
      details: {
        Profile: "Cherry",
        Material: "PBT Plastic",
        Legends: "Dye-Sublimated",
        Designer: "Hazzy",
        Compatibility: "Cherry MX and compatible switches",
        "Number of Keys": "157 keys",
      },
      reviews: [
        {
          author: "Alice Johnson",
          rating: 5,
          comment: "These keycaps are absolutely beautiful. They look and feel amazing on my keyboard.",
        },
        {
          author: "Bob Williams",
          rating: 4,
          comment: "The colors are gorgeous and the quality is top-notch. A bit expensive, but worth it in my opinion.",
        },
      ],
    },
    {
      id: "3",
      name: "Gateron Yellow Switches",
      description:
        "A popular choice among mechanical keyboard enthusiasts, Gateron Yellow switches are linear switches known for their smooth keystrokes and affordable price. They have a slightly heavier actuation force than Gateron Red switches.",
      price: 25,
      imageUrl: "/images/gateron-yellow.webp",
      category: "Switches",
      images: [
        "/images/gateron-yellow.webp",
        "/images/gateron-yellow-1.webp",
      ],
      details: {
        Type: "Linear",
        ActuationForce: "50g",
        TravelDistance: "4.0mm",
        Mount: "5-pin (PCB Mount)",
        Manufacturer: "Gateron",
        SpringWeight: "60g (bottom out)",
        SoundProfile: "Quiet",
      },
      reviews: [
        {
          author: "Charlie Brown",
          rating: 5,
          comment: "These switches are incredibly smooth. I love typing on them.",
        },
        {
          author: "David Lee",
          rating: 4,
          comment: "Great linear switches for the price. I highly recommend them.",
        },
      ],
    },
    {
      id: "4",
      name: "NovelKeys Deskmat",
      description:
        "A high-quality deskmat designed to enhance your workspace. It features a smooth cloth surface for precise mouse movements and a non-slip rubber base to keep it securely in place.",
      price: 30,
      imageUrl: "/images/deskmat.webp",
      category: "Accessories",
      images: [
        "/images/deskmat.webp",
        "/images/deskmat-1.webp",
        "/images/deskmat-2.webp",
      ],
      details: {
        Dimensions: "900 x 400 x 4 mm",
        Surface: "Smooth Cloth",
        Base: "Non-slip Rubber",
        "Stitched Edges": "Yes",
        Design: "Various designs available",
      },
      reviews: [
        {
          author: "Emily Davis",
          rating: 5,
          comment: "This deskmat is perfect. It's large enough for my keyboard and mouse, and it feels great to use.",
        },
        {
          author: "Frank Miller",
          rating: 4,
          comment: "Good quality deskmat. I like the design and it's very comfortable to use.",
        },
      ],
    },
    // Add more products here
  ];

  const product = products.find((p) => p.id === id);
  return product || null;
};

type LoaderData = {
  product: ProductDetails;
};

export const loader: LoaderFunction = async ({ params }) => {
  const productId = params.id;

  invariant(productId, "Missing product ID");

  const product = await getProductById(productId);

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const data: LoaderData = { product };
  return Response.json(data);
};

export const meta: MetaFunction = ({ data }) => {
  const product = (data as LoaderData)?.product;

  if (!product) {
    return [
      { title: 'Product Not Found | eShop' },
    ];
  }

  return [
    { title: `${product.name} | eShop` },
    { name: 'description', content: product.description },
  ];
};

function StarRating({ rating }: { rating: number }) {
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

export default function ProductDetailPage() {
  const { product } = useLoaderData<LoaderData>();
  const [currentImage, setCurrentImage] = useState(product.imageUrl);

  const handleImageChange = (image: string) => {
    setCurrentImage(image);
  };

  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Product Image Gallery */}
          <div>
            <div className="relative">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images?.map((image) => (
                <button
                  key={image}
                  onClick={() => handleImageChange(image)}
                  className={`border-2 rounded-md overflow-hidden hover:border-blue-500 transition-all duration-200 ${currentImage === image ? "border-blue-500" : "border-gray-300"
                    }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail of ${product.name}`}
                    className="w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600">{product.description}</p>
            <p className="text-3xl font-bold text-blue-600 mt-4">
              ${product.price}
            </p>

            {/* Add to Cart Button */}
            <Form method="post" className="mt-8">
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className="w-full px-6 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Add to Cart
              </button>
            </Form>

            {/* Product Specifications */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Specifications
              </h2>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {Object.entries(product.details || {}).map(([key, value]) => (
                  <div key={key} className="sm:col-span-1">
                    <dt className="text-base font-medium text-gray-500">
                      {key}
                    </dt>
                    <dd className="mt-1 text-base text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Reviews */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h2>
              {product.reviews && product.reviews.length > 0 ? (
                <div>
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-gray-900">{review.author}</h4>
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
          </div>
        </div>
      </main>
  );
}
