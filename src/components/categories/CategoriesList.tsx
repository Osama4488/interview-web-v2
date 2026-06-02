"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useListCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/contentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Tag, Pencil, Trash2, Check, X, FolderOpen } from "lucide-react";

type ApiErr = { data?: any; status?: number };

function getErrMsg(err: unknown) {
  const e = err as ApiErr;
  return e?.data?.error || e?.data?.message || "Request failed";
}

export function CategoriesList() {
  const { data, isLoading, isError, error } = useListCategoriesQuery();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-baseline justify-between mb-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border border-destructive/30 shadow-sm">
        <CardContent className="p-5">
          <p className="text-sm font-medium text-destructive mb-2">Failed to load categories</p>
          <pre className="text-xs text-muted-foreground bg-muted p-3 rounded-md overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

  const categories = Array.isArray(data) ? data : [];

  async function onSave(id: string) {
    const value = draft.trim();
    if (value.length < 2) { toast.error("Category must be at least 2 characters"); return; }
    try {
      await updateCategory({ id, category: value }).unwrap();
      toast.success("Category updated");
      setEditingId(null);
      setDraft("");
    } catch (e) { toast.error(getErrMsg(e)); }
  }

  async function onDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory({ id }).unwrap();
      toast.success("Category deleted");
    } catch (e) { toast.error(getErrMsg(e)); }
  }

  return (
    <Card className="border border-border shadow-sm">
      <div className="flex items-baseline justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold">Your Categories</h3>
        <span className="text-xs text-muted-foreground">{categories.length} total</span>
      </div>
      <CardContent className="p-5">
        {categories.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-5 w-5" />}
            title="No categories yet"
            description="Add your first category above to get started."
          />
        ) : (
          <div className="space-y-2">
            {categories.map((c: any) => {
              const isEditing = editingId === c._id;
              return (
                <div
                  key={c._id}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSave(c._id);
                          if (e.key === "Escape") { setEditingId(null); setDraft(""); }
                        }}
                        autoFocus
                        className="h-8 text-sm"
                      />
                      <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => onSave(c._id)}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => { setEditingId(null); setDraft(""); }}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.category}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.slug}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => { setEditingId(c._id); setDraft(c.category); }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete(c._id, c.category)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
