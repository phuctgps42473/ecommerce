import { useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

import ProductCard from "~/components/ProductCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Shop | eShop" },
    {
      name: "description",
      content: "Browse our wide selection of mechanical keyboards, keycaps, switches, and accessories.",
    },
  ];
};

const getProducts = async (): Promise<any> => {
  const products = [
    {
      id: "1",
      name: "Keychron K2",
      description: "A 75% layout (84-key) wireless mechanical keyboard.",
      price: 79,
      imageUrl: "/images/keychron-k2.webp",
      category: "Keyboards",
    },
    {
      id: "2",
      name: "GMK Botanical Keycaps",
      description: "A beautiful, nature-inspired keycap set.",
      price: 129,
      imageUrl: "/images/gmk-botanical.webp",
      category: "Keycaps",
    },
    {
      id: "3",
      name: "Gateron Yellow Switches",
      description: "Popular linear switches known for their smoothness.",
      price: 25,
      imageUrl: "/images/gateron-yellow.webp",
      category: "Switches",
    },
    {
      id: "4",
      name: "NovelKeys Deskmat",
      description: "High-quality deskmats to complete your setup.",
      price: 30,
      imageUrl: "/images/deskmat.webp",
      category: "Accessories",
    },
    {
      id: "5",
      name: "Ducky One 2 Mini",
      description: "A 60% mechanical keyboard with premium build quality.",
      price: 109,
      imageUrl: "/images/ducky-one-2-mini.webp",
      category: "Keyboards",
    },
    {
      id: "6",
      name: "Drop ALT Mechanical Keyboard",
      description: "A compact, 65% layout keyboard with hot-swappable switches.",
      price: 180,
      imageUrl: "/images/drop-alt.webp",
      category: "Keyboards",
    },
    {
      id: "7",
      name: "Holy Panda Switches",
      description: "Highly sought-after tactile switches.",
      price: 65,
      imageUrl: "/images/holy-panda.webp",
      category: "Switches",
    },
    {
      id: "8",
      name: "SA Bliss Keycaps",
      description: "A high-profile, sculpted SA keycap set.",
      price: 149,
      imageUrl: "/images/sa-bliss.webp",
      category: "Keycaps",
    },
    {
      id: "9",
      name: "Artisan Keycap - Dragon",
      description: "A handcrafted artisan keycap featuring a dragon design.",
      price: 50,
      imageUrl: "/images/artisan-dragon.webp",
      category: "Keycaps",
    },
    {
      id: "10",
      name: "Keyboard Carrying Case",
      description: "A protective case for transporting your keyboard.",
      price: 45,
      imageUrl: "/images/keyboard-case.webp",
      category: "Accessories",
    },
  ];

  return products;
};

export const loader: LoaderFunction = async () => {
  const products = await getProducts();
  const data = { products };
  return Response.json(data);
};

export default function Products() {
  const { products } = useLoaderData();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>

        {/* Sorting and Filtering Options */}
        <div className="flex items-center space-x-4">
          {/* Sort By */}
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              defaultValue="newest"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Filter by Category (Example) */}
          <div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded">
              Category
              <svg
                className="inline-block h-4 w-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Add a dropdown or modal to select categories here */}
          </div>

          {/* Grid/List View Toggle */}
          <div className="flex items-center space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded">
              <svg
                className="h-5 w-5 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M1 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H1zM8 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H8zM15 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4z" />
                <path d="M1 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H1zM8 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H8zM15 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" />
              </svg>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded">
              <svg
                className="h-5 w-5 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
