"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOtpMutation } from "@/services/authApi";
import { useAppSelector } from "@/lib/hooks";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtpPage() {
  const router = useRouter();
  const email = useAppSelector((s) => s.session.pendingEmail) ?? "";
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

  useEffect(() => {
  if (!email) router.replace("/auth/login");
}, [email, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await verifyOtp({ email, otp }).unwrap();
    router.push("/protected/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Verify OTP</h1>
            <p className="text-sm text-slate-600">Sent to: {email || "unknown"}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button className="w-full" disabled={isLoading}>
              Verify
            </Button>
            {error && <p className="text-sm text-red-600">OTP verification failed.</p>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
