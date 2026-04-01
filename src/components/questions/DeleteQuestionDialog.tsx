"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useDeleteQuestionMutation } from "@/services/contentApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  id: string;
  questionPreview?: string;
};

export default function DeleteQuestionDialog({ id, questionPreview }: Props) {
  const [open, setOpen] = useState(false);
  const [del, delState] = useDeleteQuestionMutation();

  async function onDelete() {
    try {
      await del({ id }).unwrap();
      toast.success("Question deleted");
      setOpen(false);
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        (Array.isArray(err?.data?.issues) ? err.data.issues?.[0]?.message : null) ||
        "Failed to delete question";
      toast.error(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete question?</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-slate-600">
          This is permanent.{" "}
          {questionPreview ? (
            <span className="block mt-2 rounded border bg-slate-50 p-2 text-slate-700">
              {questionPreview.length > 120 ? questionPreview.slice(0, 120) + "…" : questionPreview}
            </span>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={delState.isLoading}>
            {delState.isLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
