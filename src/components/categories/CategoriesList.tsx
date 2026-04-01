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
      <Card>
        <CardContent className="p-5 text-sm text-slate-600">Loading categories…</CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="text-sm font-medium mb-2">Failed to load</div>
          <pre className="text-xs bg-white p-3 rounded border overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

  const categories = Array.isArray(data) ? data : [];

  async function onSave(id: string) {
    const value = draft.trim();
    if (value.length < 2) {
      toast.error("Category must be at least 2 characters");
      return;
    }

    try {
      await updateCategory({ id, category: value }).unwrap();
      toast.success("Category updated");
      setEditingId(null);
      setDraft("");
    } catch (e) {
      toast.error(getErrMsg(e));
    }
  }

  async function onDelete(id: string, name: string) {
    const ok = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await deleteCategory({ id }).unwrap();
      toast.success("Category deleted");
    } catch (e) {
      toast.error(getErrMsg(e));
    }
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="font-medium">Your categories</div>
          <div className="text-xs text-slate-500">{categories.length} total</div>
        </div>

        {categories.length === 0 ? (
          <div className="text-sm text-slate-600">
            No categories yet. Create one above.
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((c: any) => {
              const isEditing = editingId === c._id;

              return (
                <div key={c._id} className="bg-white border rounded p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Category name"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => onSave(c._id)}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setDraft("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium">{c.category}</div>
                          <div className="text-xs text-slate-500 truncate">{c.slug}</div>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(c._id);
                            setDraft(c.category);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(c._id, c.category)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
