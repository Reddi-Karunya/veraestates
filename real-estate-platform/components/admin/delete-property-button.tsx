"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deletePropertyAction } from "@/app/admin/actions/properties";

type DeletePropertyButtonProps = {
  propertyId: string;
  propertyTitle: string;
};

export function DeletePropertyButton({
  propertyId,
  propertyTitle,
}: DeletePropertyButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deletePropertyAction(propertyId);
    } catch {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete property</DialogTitle>
            <DialogDescription>
              Permanently delete &quot;{propertyTitle}&quot; and all associated
              images? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
