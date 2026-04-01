"use client";

import { useMemo, useState } from "react";
import { useListCategoriesQuery, useListQuestionsQuery } from "@/services/contentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddQuestionDialog from "@/components/questions/AddQuestionDialog";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/useDebouncedValue"
import QuestionsTableSkeleton from "@/components/questions/QuestionsTableSkeleton";
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

  const busy = qs.isLoading || qs.isFetching;

  const total = qs.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = qs.data?.items ?? [];

  // dropdown options
  const categoryOptions = useMemo(() => {
    const list = cats.data ?? [];
    return [{ _id: "", category: "All categories" }, ...list];
  }, [cats.data]);

  // ✅ Build ID -> name map for badges
  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of cats.data ?? []) map.set(c._id, c.category);
    return map;
  }, [cats.data]);



  return (
    <main className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Questions</h1>
          <p className="text-slate-600 mt-1">
            Server-side pagination + category badge mapping + client-side search (current page).
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            className="sm:w-[260px]"
            placeholder="Search question/answer…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="h-10 rounded-md border bg-white px-3 text-sm"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            disabled={cats.isLoading}
          >
            {categoryOptions.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.category}
              </option>
            ))}
          </select>

          <AddQuestionDialog />
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">




          {qs.isLoading ? (
            <QuestionsTableSkeleton />
          )
            : qs.isError ? (
              <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(qs.error, null, 2)}
              </pre>
            ) : items.length === 0 ? (
              <div className="text-sm text-slate-600">
                {items.length === 0 ? "No questions found." : "No results for your search on this page."}
              </div>
            ) : (
              <div className="overflow-auto border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="p-3 border-b w-[160px]">Category</th>
                      <th className="p-3 border-b">Question</th>
                      <th className="p-3 border-b">Answer (preview)</th>
                      <th className="p-3 border-b w-[180px]">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((q: any) => {
                      const categoryName = categoryNameById.get(q.category) ?? "Unknown";

                      return (
                        <tr key={q._id} className="hover:bg-slate-50">
                          <td className="p-3 border-b align-top">
                            <span className="inline-flex items-center rounded-full border bg-white px-2 py-1 text-xs font-medium text-slate-700">
                              {categoryName}
                            </span>
                          </td>
                          <td className="p-3 border-b align-top">{q.question}</td>
                          <td className="p-3 border-b align-top text-slate-600">
                            {q.answer.length > 120 ? q.answer.slice(0, 120) + "…" : q.answer}
                          </td>
                          <td className="p-3 border-b align-top text-slate-600">
                            {new Date(q.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Total: {total} • Page {page} / {totalPages}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || qs.isLoading}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || qs.isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
