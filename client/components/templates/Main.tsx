"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CreateFormLabel } from "@/constants";
import { useCreateForm } from "@/hooks/useCreateForm";
import { useRouter } from "next/navigation";
import { useCreateStatementBlock } from "@/hooks/blocks/useCreateStatementBlock";

export default function Main() {
  const { mutate, isPending } = useCreateForm();
  const { mutate: mutateStatement } = useCreateStatementBlock();
  const router = useRouter();

  const handleCreate = () => {
    mutate(
      undefined, // mutation payload
      {
        onSuccess: (data) => {
          console.log("Form created:", data);
          const formShortId = data.shortId;
          mutateStatement(
            { shortId: formShortId },
            {
              onSuccess: (data) => {
                router.push(`/form/${formShortId}/build?block_id=${data.id}`);
              },
            }
          );
          // create First statement block
        },
        onError: (err) => {
          console.error("Error creating form:", err);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <Button
        className="bg-gray-300 h-40 w-40 cursor-pointer hover:bg-gray-400"
        onClick={handleCreate}
      >
        <Plus className="w-12 h-12 text-black font-bold" />
      </Button>
      <h4 className="text-2xl font-semibold">{CreateFormLabel}</h4>
    </div>
  );
}
