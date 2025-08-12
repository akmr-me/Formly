import InputWithLabel from "../molecules/editor/InputWithLabel";
import Description from "../molecules/editor/Description";
import Embed from "../molecules/editor/Embed";
import TextAlign from "../molecules/editor/TextAlign";
import CoverImage from "../molecules/editor/CoverImage";
import { ImageLayout } from "../molecules/editor/ImageLayout";
import { BlockType } from "@/types";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DefaultDebounceTime } from "@/constants";
import { useUpdateCommonBlockFields } from "@/hooks/useUpdateCommonBlockFields";
import { useSearchParams } from "next/navigation";

type EditorProp = {
  selectedBlockData: BlockType;
};

export default function Editor({ selectedBlockData }: EditorProp) {
  const searchParams = useSearchParams();
  const blockId = searchParams.get("block_id") as string;

  const {
    title: defaultTitle,
    buttonText: defaultButtonText,
    textAlign,
    type,
  } = selectedBlockData || {};

  const [title, setTitle] = useState<string>(defaultTitle || "");
  const [buttonText, setButtonText] = useState<string>(defaultButtonText || "");
  const { mutate, isPending } = useUpdateCommonBlockFields(blockId, type);

  const debouncedTitleUpdate = useDebouncedCallback((value: string) => {
    console.log("Save title:", value);
    mutate({ title: value });
  }, DefaultDebounceTime);

  const debouncedButtonTextUpdate = useDebouncedCallback((value: string) => {
    console.log("Save title:", value);
    mutate({ buttonText: value });
  }, DefaultDebounceTime);

  useEffect(() => {
    setTitle(defaultTitle || "");
  }, [defaultTitle]);

  useEffect(() => {
    setButtonText(defaultButtonText || "");
  }, [defaultButtonText]);
  return (
    <div className="w-95 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        <InputWithLabel
          title="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            debouncedTitleUpdate(e.target.value);
          }}
        />

        <Description mutate={mutate} selectedBlockData={selectedBlockData} />

        <Embed />

        <TextAlign textAlign={textAlign} mutate={mutate} />

        <InputWithLabel
          title="Button Text"
          value={buttonText}
          onChange={(e) => {
            setButtonText(e.target.value);
            debouncedButtonTextUpdate(e.target.value);
          }}
        />

        <CoverImage />
        <ImageLayout />
      </div>
    </div>
  );
}
