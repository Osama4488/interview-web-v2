"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useListCategoriesQuery, useUpdateQuestionMutation } from "@/services/contentApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  item: {
    _id: string;
    category: string;
    question: string;
    answer: string;
  };
  triggerLabel?: string;
};

export default function EditQuestionDialog({ item, triggerLabel = "Edit" }: Props) {
  const [open, setOpen] = useState(false);

  const [category, setCategory] = useState(item.category);
  const [question, setQuestion] = useState(item.question);
  const [answer, setAnswer] = useState(item.answer);

  const cats = useListCategoriesQuery();
  const [updateQuestion, updateState] = useUpdateQuestionMutation();

  const categoryOptions = useMemo(() => cats.data ?? [], [cats.data]);

  function onOpenChange(v: boolean) {
    setOpen(v);
    if (v) {
      // reset form from latest item on each open
      setCategory(item.category);
      setQuestion(item.question);
      setAnswer(item.answer);
    }
  }

  async function onSubmit() {
    if (!category) return toast.error("Select a category");
    if (question.trim().length < 5) return toast.error("Question must be at least 5 characters");
    if (answer.trim().length < 1) return toast.error("Answer is required");

    try {
      await updateQuestion({
        id: item._id,
        category,
        question: question.trim(),
        answer: answer.trim(),
      }).unwrap();

      toast.success("Question updated");
      setOpen(false);
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        (Array.isArray(err?.data?.issues) ? err.data.issues?.[0]?.message : null) ||
        "Failed to update question";
      toast.error(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
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
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Answer</div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[160px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={updateState.isLoading}>
            {updateState.isLoading ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
