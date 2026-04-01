"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/services/authApi";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useMeQuery();

  useEffect(() => {
    if (!isLoading && data) {
      router.replace("/protected/dashboard");
    }
  }, [isLoading, data, router]);

  // While checking, avoid flashing login form
  if (isLoading) return <div className="min-h-screen grid place-items-center">Loading…</div>;

  // If logged in, we redirect and render nothing
  if (data) return null;

  // If not logged in, show login/signup pages
  return <>{children}</>;
}
