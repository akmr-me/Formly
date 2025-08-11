import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStatementBlock } from "@/services/block";
import { formBlocks } from "@/constants/blockTypes";

export function useCreateStatementBlock() {
  const queryClient = useQueryClient();
  //     {
  //     id: 1,
  //     type: "statement",
  //     label: "Statement",
  //     text: "Hey there 😊",
  //     color: "bg-pink-200",
  //     icon: "💬",
  //     titleLabel: "Title",
  //     titleDefaultValue: "Hey there 😀",
  //     defaultButtonText: "Let's start",
  //     description: `Primarily used as "Intro" or "Welcome" block (like in the screenshot below), but can be used anywhere in your form to display a message.`,
  //   },type: z.literal(BlockType.STATEMENT),
  // title: z.string().min(1).max(255).trim(),
  // titleLabel: z.string().min(1).max(255).trim(),
  // textAlign: z.literal(AlignType.CENTER),
  // buttonText: z.string().min(1).max(255).trim(),
  // shortId: z.string().length(8),

  return useMutation({
    mutationFn: (additionalData) => {
      const { type, titleLabel, titleDefaultValue, defaultButtonText } =
        formBlocks.find((block) => block.type === "statement") || {};
      const fullData = {
        type,
        titleLabel,
        title: titleDefaultValue,
        buttonText: defaultButtonText,
        formId: additionalData.shortId,
        textAlign: "center",
      };
      return createStatementBlock(fullData);
    },
    onSuccess: (data) => {
      //   queryClient.invalidateQueries({ queryKey: ["forms"] });
      console.log("statement block created", data);
    },
  });
}
