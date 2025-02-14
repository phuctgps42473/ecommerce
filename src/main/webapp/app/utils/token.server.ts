import { createCookie, createCookieSessionStorage } from "@remix-run/node";


export const cookieAPI = createCookie("refresh_token", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
});


export async function getRefreshToken(request: Request): Promise<string | null> {
  console.log(request);
  const cookieHeader = request.headers.get("Cookie");

  if (cookieHeader === null) {
    return null;
  } else {
    const refreshToken = await cookieAPI.parse(cookieHeader);
    if (typeof refreshToken !== "string") {
      return null;
    } else {
      return refreshToken;
    }
  }
}

export const sessionAPI = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET || ""],
    sameSite: "lax",
    path: "/",
    maxAge: 1800
  }
});

export async function getAccessToken(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get("Cookie");
  if (cookieHeader === null) {
    return null;
  }

  const session = await sessionAPI.getSession(cookieHeader);
  console.log(session.data);
  return session.data["access_token"] || null;
}

export type Tokens = {
  accessToken: string | null,
  refreshToken: string | null
}

export async function getTokens(request: Request): Promise<Tokens> {
  const accessToken = await getAccessToken(request);
  const refreshToken = await getRefreshToken(request);
  return { accessToken, refreshToken };

}
