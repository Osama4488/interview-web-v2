"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useListCategoriesQuery, useListQuestionsQuery } from "@/services/contentApi";

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <div className="text-sm text-slate-600">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-slate-500">{hint}</div>
      </CardContent>
    </Card>
  );
}

function getQuestionsTotal(data: any): number {
  // Supports multiple backend shapes:
  // 1) { total, items: [] }
  if (typeof data?.total === "number") return data.total;

  // 2) { items: [] } without total (fallback = current page size, not real total)
  if (Array.isArray(data?.items)) return data.items.length;

  // 3) [] array response
  if (Array.isArray(data)) return data.length;

  return 0;
}

export default function DashboardPage() {
  const cats = useListCategoriesQuery();

  // Cheap request: only 1 item, but if backend returns total, we get real count
  const qs = useListQuestionsQuery({ page: 1, limit: 1 });

  const categoriesCount = Array.isArray(cats.data) ? cats.data.length : 0;
  const questionsCount = getQuestionsTotal(qs.data);

  const loading = cats.isLoading || qs.isLoading;
  const hasError = cats.isError || qs.isError;

  const recentCategories =
    Array.isArray(cats.data) ? cats.data.slice(0, 5) : [];

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Your content overview (Categories + Questions).
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/protected/categories">Add Category</Link>
          </Button>
          <Button asChild>
            <Link href="/protected/questions">Add Question</Link>
          </Button>
        </div>
      </div>

      {/* Errors (debug-friendly) */}
      {hasError && (
        <pre className="text-xs bg-white p-3 rounded border overflow-auto">
          {JSON.stringify(
            { categoriesError: cats.error, questionsError: qs.error },
            null,
            2
          )}
        </pre>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Categories"
          value={loading ? "…" : String(categoriesCount)}
          hint="Per-user isolated"
        />
        <StatCard
          title="Questions"
          value={loading ? "…" : String(questionsCount)}
          hint={
            typeof qs.data?.total === "number"
              ? "Server-side total"
              : "Add `total` in API response for real count"
          }
        />
        <StatCard
          title="System"
          value="OK"
          hint="Auth cookies + Content API"
        />
      </div>

      {/* Recent categories */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Recent categories</div>
            <Link className="text-sm underline" href="/protected/categories">
              View all
            </Link>
          </div>

          {cats.isLoading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : recentCategories.length === 0 ? (
            <div className="text-sm text-slate-600">
              No categories yet. Create your first one.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentCategories.map((c: any) => (
                <div key={c._id} className="bg-white border rounded p-3">
                  <div className="font-medium">{c.category}</div>
                  <div className="text-xs text-slate-500 truncate">{c._id}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
