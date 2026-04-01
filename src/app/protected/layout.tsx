"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMeQuery, useLogoutMutation, authApi } from "@/services/authApi";
import { contentApi } from "@/services/contentApi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/lib/hooks";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "block rounded-md px-3 py-2 text-sm border",
        active ? "bg-white font-medium" : "bg-transparent hover:bg-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const me = useMeQuery();
  const [logout, logoutState] = useLogoutMutation();

  // "Logged in" = we have a userId
  const authed = useMemo(() => Boolean(me.data?.userId), [me.data?.userId]);

  // ✅ Redirect only in useEffect (never during render)
  useEffect(() => {
    if (me.isLoading) return;
    if (!authed) router.replace("/auth/login");
  }, [me.isLoading, authed, router]);

  async function onLogout() {
    try {
      await logout().unwrap();

      // Clear cached API data immediately so UI doesn't keep old data
      dispatch(authApi.util.resetApiState());
      dispatch(contentApi.util.resetApiState());

      toast.success("Logged out");
      router.replace("/auth/login");
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Logout failed");
    }
  }

  if (me.isLoading) {
    return <div className="min-h-screen grid place-items-center bg-slate-50">Loading…</div>;
  }

  // ✅ While effect redirects, render nothing (NO router call here)
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/protected/dashboard" className="font-semibold">
            Interview SaaS
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600">
              Signed in: <span className="font-medium">{me.data!.userId}</span>
            </div>
            <Button variant="outline" onClick={onLogout} disabled={logoutState.isLoading}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
          <Card>
            <CardContent className="p-3 space-y-2">
              <NavItem href="/protected/dashboard" label="Dashboard" />
              <NavItem href="/protected/categories" label="Categories" />
              <NavItem href="/protected/questions" label="Questions" />
              <NavItem href="/protected/settings" label="Settings" />
            </CardContent>
          </Card>

          <div className="text-xs text-slate-500 mt-3">
            Next: connect Content API + server-side pagination + Redis cache.
          </div>
        </aside>

        <section className="col-span-12 md:col-span-9">{children}</section>
      </div>
    </div>
  );
}