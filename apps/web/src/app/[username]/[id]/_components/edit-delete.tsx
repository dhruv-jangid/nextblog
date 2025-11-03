"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { deleteBlog } from "@/core/blog/blog.actions";
import { useAlertDialog } from "@/components/providers/alertProvider";

export const EditDelete = ({
  blogId,
  isMobile = false,
}: {
  blogId: string;
  isMobile?: boolean;
}) => {
  const router = useRouter();
  const { show } = useAlertDialog();

  const handleDeleteBlog = async () => {
    const toastId = toast.loading("Deleting...");

    try {
      await deleteBlog({ blogId });

      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div
      className={cn(
        isMobile ? "block lg:hidden" : "hidden lg:block",
        "space-x-4 mt-2"
      )}
    >
      <Button
        onClick={() => {
          show({
            title: "Edit this blog?",
            description: `ID: ${blogId}`,
            actionLabel: "Edit",
            onConfirm: () => router.push(`/edit-blog/${blogId}`),
          });
        }}
      >
        <PencilLine /> Edit
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          show({
            title: "Delete this blog?",
            actionLabel: "Delete",
            onConfirm: handleDeleteBlog,
          })
        }
      >
        <Trash2 />
      </Button>
    </div>
  );
};
