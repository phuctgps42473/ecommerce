import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { UserInfo } from "~/types/user";
import apiFetcher from "~/utils/fetcher.server";
import { sessionAPI } from "~/utils/token.server";

// const apiGuard = async (args: LoaderFunctionArgs) => async (handle: LoaderFunction) => {
//   const res = handle(args);
//   if (res instanceof Response) {
//     console.log("I am res");
//   }
//   return res;
// };

// export const loader = async (args: LoaderFunctionArgs) => {
//   return (await apiGuard(args))(({ request }) => {
//     if (request.url.includes("login")) {
//       return null
//     } else {
//       return redirect("/login")
//     }
//   });
// }

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionAPI.getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");
  if (typeof accessToken === "string") {
    try {
      const res = await apiFetcher("/api/cart/number-of-items", {
        headers: {
          Authorization: "Bearer" + accessToken
        }
      });
    } catch (error) {
      //TODO: HANDLE ERROR
    }
  }

  const userInfo = session.get("user_info")
  if (userInfo !== null) {
    return Response.json({ userInfo });
  } else {
    return {};
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserLayout(props: React.PropsWithChildren) {
  const { userInfo }: { userInfo: UserInfo } = useLoaderData<typeof loader>();
  return <>
    <Header userInfo={userInfo} />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>;
}
