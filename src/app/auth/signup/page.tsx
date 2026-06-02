"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/services/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setPendingEmail } from "@/slices/sessionSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowRight, AlertCircle } from "lucide-react";

type ApiError = { data?: any; status?: number };

function extractFirstIssueMessage(err: unknown): string {
  const e = err as ApiError;
  const data = e?.data;
  if (data?.issues?.length) return data.issues[0]?.message ?? "Validation error";
  return data?.message ?? "Signup failed";
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signup({ name, email, password, role: "user" }).unwrap();
      toast.success("Account created! Please verify your OTP.");
      dispatch(setPendingEmail(email));
      router.push("/auth/verify-otp");
    } catch (err) {
      toast.error(extractFirstIssueMessage(err));
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col justify-between p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">Interview SaaS</span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          {["Organize questions by category", "Search and filter with ease", "Prepare for every round"].map((f) => (
            <div key={f} className="flex items-center gap-3 text-white/80 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-white/60 shrink-0" />
              {f}
            </div>
          ))}
        </div>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/5" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">Interview SaaS</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">Start organizing your interview prep in minutes.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full name</label>
              <Input
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {extractFirstIssueMessage(error)}
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Create account"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
