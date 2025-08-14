import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStatementBlock } from "@/services/block";
import useUpdateBlockIdInUrl from "../useUpdateBlockIdInUrl";

export function useCreateNewBlock(shortId: string) {
  const queryClient = useQueryClient();
  const { currentBlockId, handleChangeBlockId } = useUpdateBlockIdInUrl();

  return useMutation({
    mutationFn: (additionalData: unknown) => {
      if (typeof additionalData !== "object") {
        throw new Error("additionalData must be an object");
      }

      const fullData = {
        ...additionalData,
        formId: shortId,
        referenceBlockId: currentBlockId,
      };
      return createStatementBlock(fullData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forms", shortId, "blocks"] });
      handleChangeBlockId(data.id);
      console.log("statement block created", data);
    },
  });
}
