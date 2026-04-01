// src/services/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "./baseQuery";

/** ---- DTOs / Response Types ---- */
export type UserDto = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type SignupResponse = {
  ok: true;
  requires2FA: boolean;
  message: string;
};

export type LoginResponse =
  | { requires2FA: true; message: string }
  | { requires2FA: false; user: UserDto };

export type VerifyOtpResponse = {
  user: UserDto;
};

export type MeResponse = {
  userId: string;
};

/** ---- API ---- */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: authBaseQuery,
  endpoints: (b) => ({
    signup: b.mutation<
      SignupResponse,
      { name: string; email: string; password: string; role: string }
    >({
      query: (body) => ({ url: "/api/auth/signup", method: "POST", body }),
    }),

    login: b.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
    }),

    verifyOtp: b.mutation<VerifyOtpResponse, { email: string; otp: string }>({
      query: (body) => ({ url: "/api/auth/verify-otp", method: "POST", body }),
    }),

    me: b.query<MeResponse, void>({
      query: () => ({ url: "/api/auth/me", method: "GET" }),
    }),

    logout: b.mutation<{ ok: boolean }, void>({
      query: () => ({ url: "/api/auth/logout", method: "POST" }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;