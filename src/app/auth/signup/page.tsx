"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/services/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setPendingEmail } from "@/slices/sessionSlice";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApiError = {
  data?: any;
  status?: number;
};

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  function extractFirstIssueMessage(err: unknown): string {
    const e = err as ApiError;
    const data = e?.data;

    if (data?.issues?.length) {
      // show first zod issue (simple for now)
      return data.issues[0]?.message ?? "Validation error";
    }
    return data?.message ?? "Signup failed";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await signup({ name, email, password ,role}).unwrap();
      toast.success("Account created. Verify OTP.");
      dispatch(setPendingEmail(email));
      router.push("/auth/verify-otp");
    } catch (err) {
      toast.error(extractFirstIssueMessage(err));
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Create account</h1>
            <p className="text-sm text-slate-600">Sign up then verify OTP.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              placeholder="Password (min 8 chars)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="w-full" disabled={isLoading}>
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
