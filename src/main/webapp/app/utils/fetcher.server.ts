import axios from "axios";
// import { cookieAPI, sessionAPI } from "./token.server";

const apiFetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.API_URL,
  timeout: 3000,
});

// const loz = async (request: Request) => {
//   const accessToken = await getSessionData(request, "access_token");

//   const fetcher = axios.create({
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: typeof accessToken === "string" ? "Bearer " + accessToken : ""
//     },
//     baseURL: process.env.API_URL,
//     timeout: 3000,
//   });


//   fetcher.interceptors.response.use((res) => {
//     res.headers.
//   }, async (error: AxiosError) => {
//     if (error.status === 403) {
//       const refreshtoken = await getRefreshToken(request);
//       if (typeof refreshtoken !== "string") {
//         throw redirect("/login");
//       } else {
//         const res = await fetcher("/refresh-token", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + refreshtoken
//           },
//         });
//         const { accessToken, refreshToken, refreshTokenExpiresInSecond }: TokensResponse = res.data;
//       }
//     }
//   });

//   return fetcher;
// }

export default apiFetcher;
