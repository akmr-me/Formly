import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlock, duplicateBlock } from "@/services/block";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function useDuplicateOrDelete(blockId: string) {
  const queryClient = useQueryClient();
  const params = useParams();
  const formId = params.formId as string;

  const duplicateMutation = useMutation({
    mutationFn: () => duplicateBlock(blockId),
    onSuccess: () => {
      // Refresh any queries that depend on the blocks list
      queryClient.invalidateQueries({ queryKey: ["forms", formId, "blocks"] });
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(getErrorMessage(err));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBlock(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", formId, "blocks"] });
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(getErrorMessage(err));
    },
  });

  return {
    duplicateBlock: duplicateMutation.mutate,
    duplicateLoading: duplicateMutation.isPending,
    deleteBlock: deleteMutation.mutate,
    deleteLoading: deleteMutation.isPending,
  };
}
