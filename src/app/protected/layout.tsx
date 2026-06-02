"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMeQuery, useLogoutMutation, authApi } from "@/services/authApi";
import { contentApi } from "@/services/contentApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/hooks";
import {
  LayoutDashboard,
  Tag,
  HelpCircle,
  Settings,
  LogOut,
  Loader2,
  BookOpen,
} from "lucide-react";

const NAV = [
  { href: "/protected/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/protected/categories", label: "Categories", icon: Tag },
  { href: "/protected/questions", label: "Questions", icon: HelpCircle },
  { href: "/protected/settings", label: "Settings", icon: Settings },
];

function NavItem({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const me = useMeQuery();
  const [logout, logoutState] = useLogoutMutation();
  const authed = useMemo(() => Boolean(me.data?.userId), [me.data?.userId]);

  useEffect(() => {
    if (me.isLoading) return;
    if (!authed) router.replace("/auth/login");
  }, [me.isLoading, authed, router]);

  async function onLogout() {
    try {
      await logout().unwrap();
      dispatch(authApi.util.resetApiState());
      dispatch(contentApi.util.resetApiState());
      toast.success("Logged out successfully");
      router.replace("/auth/login");
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Logout failed");
    }
  }

  if (me.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  const initials = me.data?.userId?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col fixed inset-y-0 z-50 border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Interview SaaS</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <NavItem key={href} href={href} label={label} Icon={Icon} />
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-foreground">{me.data?.userId}</p>
              <p className="text-xs text-muted-foreground">Signed in</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={onLogout}
              disabled={logoutState.isLoading}
              title="Logout"
            >
              {logoutState.isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-4 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <BookOpen className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Interview SaaS</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          disabled={logoutState.isLoading}
          className="text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60">
        <div className="min-h-screen pt-14 pb-20 md:pt-0 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
