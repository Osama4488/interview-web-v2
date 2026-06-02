"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOtpMutation } from "@/services/authApi";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Interview SaaS</span>
        </div>

        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a one-time code to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">One-time password</label>
            <Input
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Invalid code. Please try again or go back to request a new one.
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? "Verifying…" : "Verify & continue"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="font-medium text-primary hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  );
}
