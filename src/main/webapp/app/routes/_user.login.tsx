/* eslint-disable no-case-declarations */
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { TokensResponse } from "~/authentication/types";
import apiFetcher from "~/utils/fetcher.server";
import { cookieAPI, sessionAPI } from "~/utils/token.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionAPI.getSession(request.headers.get("Cookie"));

  const redirectPath = session.get("redirect_path");

  return Response.json({ redirectPath }, {
    headers: {
      "Set-Cookie": await sessionAPI.commitSession(session)
    }
  });
}

enum LoginType {
  UsernamePassword = 'usernamePassword',
  Google = 'google',
}

function generateGoogleLoginUrl(redirectPath: string) {
  const clientId = '252315358035-0hti40fuvvfi7u7bc9tgb4e9ljpmkbfo.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:5173/authenticate/oauth2/code/google';
  const responseType = 'code';
  const scope = 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  const includeGrantedScopes = 'true';
  const state = redirectPath;

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&include_granted_scopes=${includeGrantedScopes}`;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const loginType = formData.get("login-type");


  const redirectPath = formData.get("redirect-path")?.toString() || "/";

  switch (loginType) {
    case LoginType.Google:
      return redirect(generateGoogleLoginUrl(redirectPath));

    default:
      const email = formData.get("email")!.valueOf();
      const password = formData.get("password")!.valueOf();
      try {
        const res = await apiFetcher("/authenticate", { method: "POST", data: { email, password } });
        const { accessToken, refreshToken, refreshTokenExpiresInSecond }: TokensResponse = res.data;
        const session = await sessionAPI.getSession(request.headers.get("Cookie"));
        session.set("access_token", accessToken);
        const userResponse = apiFetcher("/users/me", {
          headers: {
            "Authorization": "Bearer " + accessToken
          }
        });

        // TODO: HANDLE ERROR
        const userInfo = (await userResponse).data.data;
        session.set("user_info", userInfo);


        await sessionAPI.commitSession(session);
        await cookieAPI.serialize(refreshToken, { maxAge: refreshTokenExpiresInSecond });

        return redirect(redirectPath, {
            headers: [
              ["Set-Cookie", await sessionAPI.commitSession(session)],
              ["Set-Cookie", await cookieAPI.serialize(refreshToken, { maxAge: refreshTokenExpiresInSecond })]
            ]
          }
        );
      } catch (error) {
        console.log("Handle this");
      }
  }

}


export default function Login() {
  const { redirectPath } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" className="space-y-6">
            <input name="redirect-path" readOnly hidden value={redirectPath} />
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  value="true"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to=""
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                value={LoginType.UsernamePassword}
                name="login-type"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <Form method="post" action="/login">
                  <input name="redirect-path" readOnly hidden value={redirectPath} />

                  <button
                    name="login-type"
                    value={LoginType.Google}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.99 20 10c0-5.523-4.477-10-10-10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Form>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
