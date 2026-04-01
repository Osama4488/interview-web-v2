"use client";

import { useMemo, useState } from "react";
import { useCreateQuestionMutation, useListCategoriesQuery } from "@/services/contentApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
  triggerLabel?: string;
};

export default function AddQuestionDialog({ triggerLabel = "+ Add Question" }: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const cats = useListCategoriesQuery();
  const [createQuestion, createState] = useCreateQuestionMutation();

  const categoryOptions = useMemo(() => cats.data ?? [], [cats.data]);

  async function onSubmit() {
    // frontend guard (backend zod will still enforce)
    if (!category) return toast.error("Select a category");
    if (question.trim().length < 5) return toast.error("Question must be at least 5 characters");
    if (answer.trim().length < 1) return toast.error("Answer is required");

    try {
      await createQuestion({
        category,
        question: question.trim(),
        answer: answer.trim(),
      }).unwrap();

      toast.success("Question added");
      setCategory("");
      setQuestion("");
      setAnswer("");
      setOpen(false);
    } catch (err: any) {
      // normalize typical backend shapes
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        (Array.isArray(err?.data?.issues) ? err.data.issues?.[0]?.message : null) ||
        "Failed to add question";
      toast.error(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Category</div>
            <select
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={cats.isLoading}
            >
              <option value="">Select category…</option>
              {categoryOptions.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Question</div>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Explain event loop in JavaScript"
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Answer</div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write a strong answer…"
              className="min-h-[160px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={createState.isLoading}>
            {createState.isLoading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
