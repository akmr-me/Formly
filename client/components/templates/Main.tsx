"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CreateFormLabel, CreateFormLoadingLabel } from "@/constants";
import { useCreateForm } from "@/hooks/useCreateForm";
import { useRouter } from "next/navigation";
import { useCreateStatementBlock } from "@/hooks/blocks/useCreateStatementBlock";
import { toast } from "sonner";

export default function Main() {
  const { mutate, isPending } = useCreateForm();
  const { mutate: mutateStatement } = useCreateStatementBlock();
  const router = useRouter();

  const handleCreate = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        const formShortId = res.data.shortId;
        toast.success("Form created!");

        mutateStatement(
          { shortId: formShortId },
          {
            onSuccess: (blockRes) => {
              router.push(
                `/form/${formShortId}/build?block_id=${blockRes.data.id}`
              );
            },
            onError: () => {
              toast.error("Failed to create first block");
            },
          }
        );
      },
      onError: () => {
        toast.error("Failed to create form");
      },
    });
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <Button
        className="bg-gray-300 h-40 w-40 cursor-pointer hover:bg-gray-400"
        onClick={handleCreate}
        disabled={isPending}
      >
        <Plus className="w-12 h-12 text-black font-bold" />
      </Button>
      <h4 className="text-2xl font-semibold">
        {isPending ? CreateFormLoadingLabel : CreateFormLabel}
      </h4>
    </div>
  );
}
