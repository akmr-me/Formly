import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlockField } from "@/services/block";
import { CoverImageLayout, TextAlignType } from "@/types";
import { useParams } from "next/navigation";

export type UpdateBlockPayload = {
  title?: string;
  buttonText?: string;
  type: string;
  textAlign?: TextAlignType;
  coverImageLayout?: CoverImageLayout;
  optionalConfig?: Record<string, unknown>;
  required?: boolean;
  placeholder?: string;
  urlParameter?: string;
};

export function useUpdateCommonBlockFields(blockId: string, type: string) {
  const queryClient = useQueryClient();
  const params = useParams();
  const formId = params.formId as string;

  return useMutation({
    mutationFn: (data: Partial<UpdateBlockPayload>) =>
      updateBlockField(blockId, { ...data, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      queryClient.invalidateQueries({ queryKey: ["forms", formId, "blocks"] });
    },
  });
}
