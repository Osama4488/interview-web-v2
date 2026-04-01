"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/services/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setPendingEmail } from "@/slices/sessionSlice";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await login({ email, password }).unwrap();

// If backend says OTP required → go verify
if (res?.requires2FA) {
  dispatch(setPendingEmail(email));
  router.push("/auth/verify-otp");
  return;
}

// OTP not required → go straight to dashboard
router.push("/protected/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Sign in</h1>
            <p className="text-sm text-slate-600">Login then verify OTP.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" disabled={isLoading}>
              Continue
            </Button>
            {error && <p className="text-sm text-red-600">Login failed.</p>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
