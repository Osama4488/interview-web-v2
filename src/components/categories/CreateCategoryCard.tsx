"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/services/contentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

type ApiErr = { data?: any; status?: number };

function getErrMsg(err: unknown) {
  const e = err as ApiErr;
  return e?.data?.error || e?.data?.message || "Request failed";
}

export function CreateCategoryCard() {
  const [category, setCategory] = useState("");
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  async function onCreate() {
    const value = category.trim();
    if (value.length < 2) {
      toast.error("Category must be at least 2 characters");
      return;
    }
    try {
      await createCategory({ category: value }).unwrap();
      toast.success("Category created");
      setCategory("");
    } catch (err) {
      toast.error(getErrMsg(err));
    }
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">New Category</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Group your questions by topic or technology.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. React, System Design, Behavioral…"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); onCreate(); }
            }}
            className="flex-1"
          />
          <Button onClick={onCreate} disabled={isLoading} size="sm" className="gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
