"use client";

import { useMemo, useState } from "react";
import { useListCategoriesQuery, useListQuestionsQuery } from "@/services/contentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddQuestionDialog from "@/components/questions/AddQuestionDialog";
import EditQuestionDialog from "@/components/questions/EditQuestionDialog";
import DeleteQuestionDialog from "@/components/questions/DeleteQuestionDialog";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import QuestionsTableSkeleton from "@/components/questions/QuestionsTableSkeleton";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, SlidersHorizontal, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function QuestionsPage() {
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const cats = useListCategoriesQuery();
  const debouncedSearch = useDebouncedValue(search, 400);

  const qs = useListQuestionsQuery({
    category: categoryId || undefined,
    search: debouncedSearch.trim() || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const total = qs.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = qs.data?.items ?? [];

  const categoryOptions = useMemo(() => {
    const list = cats.data ?? [];
    return [{ _id: "", category: "All categories" }, ...list];
  }, [cats.data]);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of cats.data ?? []) map.set(c._id, c.category);
    return map;
  }, [cats.data]);

  const activeCategory = categoryId
    ? (cats.data ?? []).find((c: any) => c._id === categoryId)?.category
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Questions"
        description="Browse, search, and manage your interview Q&A bank."
        action={<AddQuestionDialog />}
      />

      {/* Filter bar */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9"
                placeholder="Search questions or answers…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="relative sm:w-56">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring appearance-none disabled:opacity-50"
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                disabled={cats.isLoading}
              >
                {categoryOptions.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.category}</option>
                ))}
              </select>
            </div>
          </div>

          {(search || activeCategory) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Filtering by:</span>
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  "{search}"
                  <button onClick={() => { setSearch(""); setPage(1); }} className="hover:text-primary/60">×</button>
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {activeCategory}
                  <button onClick={() => { setCategoryId(""); setPage(1); }} className="hover:text-primary/60">×</button>
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-border shadow-sm">
        <div className="overflow-hidden">
          {qs.isLoading ? (
            <div className="p-5"><QuestionsTableSkeleton /></div>
          ) : qs.isError ? (
            <div className="p-5">
              <pre className="text-xs text-muted-foreground bg-muted p-3 rounded-md overflow-auto">
                {JSON.stringify(qs.error, null, 2)}
              </pre>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<HelpCircle className="h-5 w-5" />}
              title="No questions found"
              description={search || categoryId ? "Try adjusting your search or filters." : "Add your first question to get started."}
            />
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[150px]">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Question</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Answer preview</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell w-[160px]">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((q: any) => {
                    const categoryName = categoryNameById.get(q.category) ?? "Unknown";
                    return (
                      <tr key={q._id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 align-top">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            {categoryName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <p className="font-medium text-foreground leading-snug">{q.question}</p>
                        </td>
                        <td className="px-4 py-3.5 align-top text-muted-foreground hidden lg:table-cell">
                          <p className="leading-relaxed">
                            {q.answer.length > 100 ? q.answer.slice(0, 100) + "…" : q.answer}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 align-top text-muted-foreground text-xs hidden md:table-cell whitespace-nowrap">
                          {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <div className="flex items-center justify-end gap-1">
                            <EditQuestionDialog item={q} />
                            <DeleteQuestionDialog id={q._id} questionPreview={q.question} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!qs.isLoading && !qs.isError && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {total > 0 ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total}` : "No results"}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || qs.isLoading}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || qs.isLoading}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
