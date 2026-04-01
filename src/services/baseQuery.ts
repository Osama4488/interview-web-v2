import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE!;
const CONTENT_BASE = process.env.NEXT_PUBLIC_CONTENT_BASE!;

export const authBaseQuery = fetchBaseQuery({
  baseUrl: AUTH_BASE,
  credentials: "include", // send/receive httpOnly cookies
});

const rawContentBaseQuery = fetchBaseQuery({
  baseUrl: CONTENT_BASE,
  credentials: "include",
});

export const contentBaseQueryWithReauth: typeof rawContentBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawContentBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // refresh session once
    const refresh = await authBaseQuery(
      { url: "/api/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (!refresh.error) {
      // retry original request once
      result = await rawContentBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
