import { useMutation } from "@tanstack/react-query";
import { createNewBlock } from "@/services/block";
import { AlignType, BlockTypeEnum } from "@/types";

// This creates the first block
export function useCreateStatementBlock() {
  return useMutation({
    mutationFn: (additionalData: { shortId: string }) => {
      const fullData = {
        type: BlockTypeEnum.STATEMENT,
        titleLabel: "Title",
        title: "Hey there 😀",
        buttonText: "Let's start",
        formId: additionalData.shortId,
        textAlign: AlignType.CENTER,
        position: 100,
      };
      return createNewBlock(fullData);
    },
    onSuccess: (data) => {
      //   queryClient.invalidateQueries({ queryKey: ["forms"] });
      console.log("statement block created", data);
    },
  });
}
