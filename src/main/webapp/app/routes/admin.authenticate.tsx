import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { TokensResponse } from "~/authentication/types";
import  apiFetcher  from "~/utils/fetcher.server";
import { cookieAPI, sessionAPI } from "~/utils/token.server";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  try {
    const res = await apiFetcher("/admin/authenticate", {
      method: "post",
      data: form
    });

    const { accessToken, refreshToken, refreshTokenExpiresInSecond }: TokensResponse = res.data;

    const session = await sessionAPI.getSession(request.headers.get("Cookie"));
    session.set("access_token", accessToken);
    return redirect("/admin/dashboard", {
      headers: [
        ["Set-Cookie", await sessionAPI.commitSession(session)],
        ["Set-Cookie", await cookieAPI.serialize(refreshToken, { maxAge: refreshTokenExpiresInSecond })]
      ]
    })
  } catch (error) {
    console.error(error);
  }


  return {};
}

export default function AdminLogin() {
  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Admin Login
      </h1>

      <Form method="post" className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </div>
      </Form>
    </main>
  );
}
