import { LoaderFunctionArgs } from "@remix-run/node";
import { apiFetcher } from "~/utils/fetcher.server";
import { getRefreshToken } from "~/utils/token.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Request", request);
  const refreshToken = await getRefreshToken(request);
  console.log(refreshToken);


  if (refreshToken === null) {
    return new Response(null, {status: 403});
  }

  try {
    const res = await apiFetcher("/refresh-token", {
      headers: {
        "Cookie": refreshToken
      }
    });

    return Response.json(res.data);
  } catch (error) {
    return new Response(null, {status: 403});
  }


}
