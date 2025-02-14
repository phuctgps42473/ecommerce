import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import axios from "axios";
import { TokensResponse } from "~/authentication/types";
import { cookieAPI, sessionAPI } from "~/utils/token.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const redirectPath = url.searchParams.get("state") || "/";

  if (code === null) {
    return redirect("/login");
  }

  try {
    const res = await axios.post("http://localhost:8080/api/oauth/code_grant/google", { code });
    const { accessToken, refreshToken, refreshTokenExpiresInSecond }: TokensResponse = res.data;

    const session = await sessionAPI.getSession(request.headers.get("Cookie"));
    session.set("access_token", accessToken);
    return redirect(redirectPath, {
      headers: [
        ["Set-Cookie", await sessionAPI.commitSession(session)],
        ["Set-Cookie", await cookieAPI.serialize(refreshToken, { maxAge: refreshTokenExpiresInSecond })]
      ]
    })

  } catch (error) {
    return redirect("/login");
  }
}


