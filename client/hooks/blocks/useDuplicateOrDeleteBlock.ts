import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlock, duplicateBlock } from "@/services/block";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getErrorMessage } from "@/lib/getErrorMessage";
import useUpdateBlockIdInUrl from "../useUpdateBlockIdInUrl";
import { BlockType } from "@/types";

export function useDuplicateOrDelete(blockId: string) {
  const queryClient = useQueryClient();
  const params = useParams();
  const formId = params.formId as string;
  const { handleChangeBlockId } = useUpdateBlockIdInUrl();

  const duplicateMutation = useMutation({
    mutationFn: () => duplicateBlock(blockId),
    onSuccess: (data) => {
      handleChangeBlockId(data.id);
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
      const cachedBlocksData = queryClient.getQueryData([
        "forms",
        formId,
        "blocks",
      ]);
      const deleteBlockIndex = (cachedBlocksData.blocks || []).findIndex(
        (block: BlockType) => block.id === blockId
      );

      const nextRedirectBlockIndex =
        deleteBlockIndex == 0 ? 1 : deleteBlockIndex - 1;
      handleChangeBlockId(cachedBlocksData.blocks[nextRedirectBlockIndex].id);
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
