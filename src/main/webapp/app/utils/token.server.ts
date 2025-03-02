import { createCookie, createCookieSessionStorage } from "@remix-run/node";


export const cookieAPI = createCookie("refresh_token", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
});

export function setRefreshToken(refreshToken: string, maxAge: number) {
  return cookieAPI.serialize(refreshToken, { maxAge })
}


export async function getRefreshToken(request: Request): Promise<string | null> {
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

export async function getSessionData<T>(request: Request, name: string): Promise<T | null> {
  const session = await sessionAPI.getSession(request.headers.get("Cookie"));
  return session.get(name);
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

export async function setAccessToken(request: Request, accessToken: string) {
  const session = await sessionAPI.getSession(request.headers.get("Cookie"));
  session.set("access_token", accessToken);
}

export async function getAccessToken(request: Request): Promise<string | null> {
  const session = await sessionAPI.getSession(request.headers.get("Cookie"));
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
