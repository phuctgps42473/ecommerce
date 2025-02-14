import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { ChangeEvent, FormEvent, useState } from "react";
import invariant from "tiny-invariant";

const branchList = [
  {
    id: 1,
    name: "gateron"
  },
  {
    id: 2,
    name: "hmx"
  },
  {
    id: 3,
    name: "langtu"
  },
  {
    id: 4,
    name: "iloubee"
  },
  {
    id: 5,
    name: "xinmeng"
  },
  {
    id: 6,
    name: "aula"
  },
  {
    id: 7,
    name: "mchose"
  }
]

export const loader: LoaderFunction = async () => {
  return null;
};

type NewBookForm = {
  categoryId: number,
  brandId: number,
  productName: string,
  sku: string,
  weight: number,
  description: string,
  costPrice: number,
  price: number,
  stock: number,
  imageUrl: number,
  details: {
    [key: string]: string
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const details = form.get("details")!.toString();
  console.log(JSON.parse(details));

  invariant(
    typeof form.get("category") !== "undefined" &&
    typeof form.get("brand") !== "undefined" &&
    typeof form.get("sku") !== "undefined" &&
    typeof form.get("name") !== "undefined" &&
    typeof form.get("weight") !== "undefined" &&
    typeof form.get("description") !== "undefined" &&
    typeof form.get("cost-price") !== "undefined" &&
    typeof form.get("price") !== "undefined" &&
    typeof form.get("stock") !== "undefined" &&
    typeof form.get("imageUrl") !== "undefined" &&
    typeof form.get("details") !== "undefined"
  );

  const payload: NewBookForm = {
    categoryId: form.get("category")!,
    brandId: form.get("brand"),
    sku: form.get("sku"),
    productName: form.get("name"),
    weight: form.get("weight"),
    description: form.get("description"),
    costPrice: form.get("cost-price"),
    price: form.get("price"),
    stock: form.get("stock"),
    imageUrl: form.get("imageUrl"),
    details: form.get("details")
  }
  console.log(form);

  return {};
}

export default function AdminNewProduct() {
  const submit = useSubmit();

  const [mediaFile, setMediaFiles] = useState<Array<File>>([]);
  const [previewLinks, setPreviewLinks] = useState<Array<string>>([]);
  const [details, setDetails] = useState("");

  // function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   const json = JSON.parse(details);
  //   e.preventDefault();

  //   console.log(json);
  //   (e.currentTarget!.querySelector("#details")!).value = JSON.stringify(json);

  //   submit(e.currentTarget);
  // }

  function handleUploadProfileImage(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files !== null && files.length !== 0) {
      const previewList = [];
      const fileList = [];
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);

        if (file !== null) {
          fileList.push(file);

          const blob = file.slice(0);
          const url = URL.createObjectURL(blob);

          previewList.push(url);
        }
      }

      setPreviewLinks(previewList);
      setMediaFiles(fileList);
    }

  }

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>

      <Form method="post" className="mt-8">

        {/* Category */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Category</option>
            <option value="keyboards">Keyboards</option>
            <option value="keycaps">Keycaps</option>
            <option value="switches">Switches</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label
            htmlFor="brand"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Branch
          </label>
          <select
            id="brand"
            name="brand"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Branch</option>
            {branchList.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Product Name */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Weight */}
        <div className="mb-6">
          <label
            htmlFor="stock"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Weight (gram)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            required
            min="0"
            step="0.1"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Cost Price */}
        <div className="mb-6">
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Cost Price
          </label>
          <input
            type="number"
            id="cost-price"
            name="cost-price"
            required
            min="0"
            step="0.01"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="0.01"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Stock */}
        <div className="mb-6">
          <label
            htmlFor="stock"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            required
            min="0"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label
            htmlFor="imageUrl"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Image URL
          </label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            multiple
            onChange={handleUploadProfileImage}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <div className="flex gap-2">
            {previewLinks.length != 0 ?
              previewLinks.map(link =>
                <img src={link} key={link} width={100} height={100} alt="preview" />)
              : null}
          </div>
        </div>

        {/* Other Details (Optional) - You can add more fields here */}
        <div className="mb-6">
          <label
            htmlFor="details"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Other Details (Optional)
          </label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            id="details"
            name="details"
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter any other details in JSON format (e.g., {'key': 'value'})"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Product
        </button>
      </Form>
    </main>
  );
}
