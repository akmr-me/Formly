import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewBlock } from "@/services/block";
import useUpdateBlockIdInUrl from "../useUpdateBlockIdInUrl";
import { DefaultBlockDataType } from "@/types";

export function useCreateNewBlock(shortId: string) {
  const queryClient = useQueryClient();
  const { currentBlockId, handleChangeBlockId } = useUpdateBlockIdInUrl();

  return useMutation({
    mutationFn: (additionalData: Omit<DefaultBlockDataType, "formId">) => {
      if (typeof additionalData !== "object") {
        throw new Error("additionalData must be an object");
      }

      const fullData = {
        ...additionalData,
        formId: shortId,
        referenceBlockId: currentBlockId,
      };
      return createNewBlock(fullData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forms", shortId, "blocks"] });
      if (data.status == "success") handleChangeBlockId(data.data.id);
      console.log("new block created", data);
    },
  });
}
