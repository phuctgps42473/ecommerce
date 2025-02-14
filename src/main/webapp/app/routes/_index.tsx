import { useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

import ProductCard from "../components/ProductCard";
// import apiFetcher from "~/utils/fetcher.server";
import { getAccessToken, getRefreshToken } from "~/utils/token.sever";
import axios from "axios";
import apiFetcher from "~/utils/fetcher.server";
import UserLayout from "./_user";

export const meta: MetaFunction = () => {
  return [
    { title: "eShop - Your One-Stop Shop for Mechanical Keyboards" },
    {
      name: "description",
      content:
        "Discover a wide selection of mechanical keyboards, keycaps, switches, and accessories at eShop.",
    },
  ];
};

type LoaderData = {
  featuredProducts: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }[];
  categories: {
    name: string;
    imageUrl: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {

  const featuredProducts = [
    {
      id: "1",
      name: "Keychron K2",
      description: "A 75% layout (84-key) wireless mechanical keyboard.",
      price: 79,
      imageUrl: "https://owlgaming.vn/wp-content/uploads/2021/01/Keychron-K2-V2-vo-nhua.jpg",
    },
    {
      id: "2",
      name: "GMK Botanical Keycaps",
      description: "A beautiful, nature-inspired keycap set.",
      price: 129,
      imageUrl: "https://azaudio.vn/wp-content/uploads/2024/01/GMK_Botanical_2_OMNI_Bauer_X_002V3_dist.jpg",
    },
    {
      id: "3",
      name: "Gateron Yellow Switches",
      description: "Popular linear switches known for their smoothness.",
      price: 25,
      imageUrl: "https://bizweb.dktcdn.net/100/436/596/products/d77964b9-d141-4108-b172-404d1b363c02.jpg?v=1632925816507",
    },
    {
      id: "4",
      name: "NovelKeys Deskmat",
      description: "High-quality deskmats to complete your setup.",
      price: 30,
      imageUrl: "https://keygem.com/cdn/shop/files/DSC00139.png?v=1722177658&width=4000",
    },
  ];

  const categories = [
    {
      name: "Keyboards",
      imageUrl: "https://images.unsplash.com/photo-1722666729530-a64e3ab266fc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Keycaps",
      imageUrl: "https://images.unsplash.com/photo-1696393702034-d991581bc0b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Switches",
      imageUrl: "https://images.unsplash.com/photo-1632125972828-a4cfdec70f00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1716794048094-5f7a6c911dc8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];


  const data: LoaderData = { featuredProducts, categories };

  return Response.json(data);
};

export default function Index() {
  const { featuredProducts, categories } = useLoaderData<LoaderData>();

  return (
    <UserLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Your Gateway to the World of{" "}
              <span className="text-blue-600">Mechanical Keyboards</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Explore our curated collection of keyboards, keycaps, switches,
              and more.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
              <div className="rounded-md shadow">
                <a
                  href="/products"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Shop Now
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="/about"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {categories.map((category) => (
              <a key={category.name} href={`/products?category=${category.name.toLowerCase()}`} className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {category.name}
                </h3>
              </a>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Join Our Community
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Stay up-to-date with the latest news, product releases, and
              exclusive offers.
            </p>
            <div className="mt-6">
              <a
                href="/newsletter"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
}
