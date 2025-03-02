import { useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

import ProductCard from "../components/ProductCard";
import apiFetcher from "~/utils/fetcher.server";
import { PageResponse, PreviewProduct } from "~/types/product";

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
  hotProductList: PreviewProduct[];
  newArrivalList: PreviewProduct[];
  onSaleProductList: PreviewProduct[];
  categories: {
    name: string;
    imageUrl: string;
  }[];
};

export const loader: LoaderFunction = async () => {
  const [hotProductList, newArrivalList, onSaleProductList]: PreviewProduct[][] =
    await Promise.allSettled(["/hot-products", "/new-arrivals", "/on-sale-products"]
      .map(url => apiFetcher("/public/products" + url))).then(responses => responses.map(response => {
        if (response.status === "fulfilled") {
          return (response.value.data as PageResponse<PreviewProduct>).content;
        } else {
          console.error(response.reason);
          return [];
        }
      }));


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


  const data: LoaderData = { categories, hotProductList, newArrivalList, onSaleProductList };

  return Response.json(data);
};

export default function Index() {
  const { hotProductList, newArrivalList, onSaleProductList, categories } = useLoaderData<LoaderData>();

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {/* TODO: REMOVE THIS */}



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


        {/* Featured Products Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Best Sellers
          </h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {hotProductList.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {newArrivalList.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            On Sale
          </h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {onSaleProductList.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        {/* TODO: CHANGE IT TO A LINK TO GROUP OR SOMETHING */}
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
    </>
  );
}
