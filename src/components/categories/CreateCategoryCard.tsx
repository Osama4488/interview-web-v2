"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/services/contentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="font-medium">Create category</div>

        <div className="flex gap-2">
          <Input
            placeholder="e.g. React, TypeScript, System Design"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCreate();
              }
            }}
          />
          <Button onClick={onCreate} disabled={isLoading}>
            Add
          </Button>
        </div>

        <p className="text-xs text-slate-500">
          Categories are unique per user (409 if you try duplicate).
        </p>
      </CardContent>
    </Card>
  );
}
