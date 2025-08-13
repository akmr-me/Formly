import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlockField } from "@/services/block";
import { CoverImageLayout, TextAlignType } from "@/types";

export type UpdateBlockPayload = {
  title?: string;
  buttonText?: string;
  type: string;
  textAlign?: TextAlignType;
  coverImageLayout?: CoverImageLayout;
};

export function useUpdateCommonBlockFields(blockId: string, type: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UpdateBlockPayload>) =>
      updateBlockField(blockId, { ...data, type }),
    onSuccess: (data) => {
      // TODO: invalidte multiple query
      console.log("updated form data", data);
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
    },
  });
}
