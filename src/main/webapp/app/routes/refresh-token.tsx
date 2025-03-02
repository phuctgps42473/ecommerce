import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import  apiFetcher  from "~/utils/fetcher.server";
import { getRefreshToken } from "~/utils/token.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const refreshToken = await getRefreshToken(request);


  if (refreshToken === null) {
    return redirect("/login", {status: 403});
  }

  try {
    const res = await apiFetcher("/refresh-token", {
      headers: {

      }
    });

    return Response.json(res.data);
  } catch (error) {
    return new Response(null, {status: 403});
  }


}
