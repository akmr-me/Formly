import { BlockType } from "@/types";
import { formBlocks } from "./blockTypes";

export const ImageLayoutOptions = [
  {
    label: "Stack",
    value: "stack",
  },
  {
    label: "Split",
    value: "split",
  },
  {
    label: "Wallpaper",
    value: "wallpaper",
  },
];

export const CreateFormLabel = "Create Form";
export const CreateFormLoadingLabel = "Creating Form...";

export const DefaultDebounceTime = 1000;

export const BlockTypeMap = formBlocks.reduce<Record<string, BlockType>>(
  (acc, block) => {
    acc[block.type] = block;
    return acc;
  },
  {}
);

export const DeleteConfirmation = {
  title: "Are you sure you want to delete this block?",
  description: "This action is irreversible.",
  confirmText: "Yes! Delete it",
  confirmVariant: "destructive",
  cancelText: "Cancel",
};
