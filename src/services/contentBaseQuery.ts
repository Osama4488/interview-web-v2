import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contentBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_CONTENT_BASE,
  credentials: "include",
});
